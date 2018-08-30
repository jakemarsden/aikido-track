/**
 * Essentially just a wrapper around Handlebars to make template loading and rendering more flexible (eg. in case we
 * wanted to change templating libraries in the future). Also gives us a place to put any template-related utilities we
 * may require.
 */
define(["handlebars", "jquery"], (Handlebars, $) => {
    "use strict";

    /**
     * Map of template names -> Promises which produce templates
     */
    const templateCache = new Map();

    /**
     * Start loading the specified template in the background. Once it has been loaded, call the specified
     * {@code callback} function. If the template cannot be loaded, log a warning message and call the specified
     * {@code failureCallback} function.
     *
     * @param name The name of the template to load
     * @param callback The function to call once the template has been loaded. The function will be passed the compiled
     * template as its only argument
     * @param failureCallback [Optional] The function to call if there was an issue loading the template. The function
     * will be passed the failure reason as its only argument. The default behaviour in the absence of this argument is
     * to throw an Error.
     * @return A function which, when called with a context object, will return the rendered HTML
     */
    function withTemplate(name, callback, failureCallback) {
        if (failureCallback === undefined) {
            failureCallback = reason => { throw new Error("Unable to load template '" + name + "': " + reason); };
        }
        getOrLoadFromCache(name)
                .then(template => {
                    callback(template);
                    return template;
                })
                .catch(reason => window.console.warn("Unable to load template '" + name + "': " + reason))
                .catch(failureCallback);
    }

    /**
     * Start loading the specified templates in the background so the next call to "withTemplate()" will be faster. It
     * is recommended to do this at the start of each script (ie. not in "onLoad()"), passing the name of every
     * template you expect to need.
     * <p/>
     * Note that it is not a <i>requirement</i> to call this function for a template to be usable, although it is
     * generally advisable.
     *
     * @param names A list of the names of the templates to preload
     */
    function preloadTemplates(names) {
        for (let i = 0; i < names.length; i++) {
            getOrLoadFromCache(names[i]);
        }
    }

    function getOrLoadFromCache(name) {
        let template = templateCache.get(name);
        if (template === undefined) {
            template = loadAndCompile(name);
            templateCache.set(name, template);
        }
        return template;
    }

    function loadAndCompile(name) {
        return load(name).then(data => Handlebars.compile(data));
    }

    function load(name) {
        return $.ajax({
            url: "/template/" + name + ".hbs",
            method: "GET",
            accepts: { handlebarstemplate: "text/x-handlebars-template;charset=UTF-8" },
            converters: { "text handlebarstemplate": window.String },
            dataType: "handlebarstemplate",
            cache: true
        });
    }

    return {
        withTemplate: withTemplate,
        preload: preloadTemplates
    };
});
