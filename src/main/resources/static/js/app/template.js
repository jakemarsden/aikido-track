/**
 * Is this class completely overkill for a simple wrapper around Handlebars? Yeah, probably, but what did you honestly
 * expect from a Java dev?
 *
 * Example usage:
 *
 * // Register and start preloading the template ASAP
 * const testTmpl = Template.register("test", ["partial1", "partial2"]);
 * ...
 * $(onLoad);
 * function onLoad() {
 *     // Ensure the template has finished loading
 *     testTmpl.resolve(tmpl =>
 *             // Render the template with a context and add it to the DOM
 *             tmpl.renderInto($("body"), testCtx));
 * }
 */
define(["handlebars", "jquery"], (Handlebars, $) => {

    /** @class Template.Def */
    class TemplateDef {
        /**
         * @param {string} name
         * @param {string[]} partials
         * @param {function():Promise<Template>} promiseFactory
         * @see {@link Template#register} to obtain an instance
         * @protected
         */
        constructor(name, partials, promiseFactory) {
            this.name = name;
            this.partials = partials;
            /** @private */
            this._promise = undefined;
            /** @private */
            this._promiseFactory = promiseFactory;
        }

        /**
         * Start loading this template in the background so subsequent calls to {@link #resolve} and
         * {@link #resolveAsPromise} are faster. It is not usually necessary to preload a template manually as
         * templates are preloaded when {@link Template#register}ed by default.
         */
        preload() {
            if (this._promise === undefined) {
                this._promise = this._promiseFactory();
                this._promiseFactory = undefined; // Don't need it anymore
            }
        }

        /**
         * @param {Template~onTemplateResolved} callback
         */
        resolve(callback) {
            this.preload();
            this._promise
                    .then(tmpl => {
                        callback(tmpl);
                        return tmpl;
                    })
                    .catch(reason => { throw new Error("Unable to resolve " + this.toString() + ": " + reason); });
        }

        /**
         * @return Promise<Template>
         */
        resolveAsPromise() {
            this.preload();
            // It's important to wrap the Promise for safety. Otherwise, the caller could chain a success callback
            // which returns something other than the original Template. This would fuck up our internal
            // Promise<Template.Def> cache and future calls to #resolve or #resloveAsPromise could behave unexpectedly
            return new Promise((res, rej) => {
                this._promise
                        .then(tmpl => {
                            res(tmpl);
                            return tmpl;
                        })
                        .catch(reason => rej(reason));
            });
        }

        /** @return {string} */
        toString() { return "Template.Def[name=" + this.name + ", partials=[" + this.partials + "]]"; }
    }

    /** @class Template */
    class Template {
        /**
         * @param {Handlebars~template} template
         * @see {@link Template.Def#resolve} or {@link Template.Def#resolveAsPromise} to obtain an instance
         * @private
         */
        constructor(template) {
            /** @private */
            this._template = template;
        }

        /**
         * @param {string} name
         * @param {string[]} [partials=[]]
         * @param {boolean} [preload=true]
         * @return {Template.Def}
         * @static
         */
        static register(name, partials, preload) {
            partials = partials == null ? [] : partials.slice();
            preload = preload !== false;

            validateName(name, false);
            partials.forEach(partial => validateName(partial, true));

            let templateDef = templateDefCache.get(name);
            if (templateDef === undefined) {
                // Template isn't yet in the cache, we'd better make one
                const templatePromiseFactory = () =>
                        fetchHandlebarsTemplateWithRequiredPartials(name, partials)
                                .then(tmpl => new Template(tmpl));
                templateDef = new Template.Def(name, partials, templatePromiseFactory);
                templateDefCache.set(name, templateDef);

            } else if (!shallowArrayEquals(templateDef.partials, partials)) {
                // A template with the specified name already exists in the cache so ensure it's compatible
                const msg = "Registration of template [name=" + name + ", partials=[" + partials + "]] failed as it " +
                        "is incompatible with a previously registered template: " + templateDef;
                throw new Error(msg);
            }
            if (preload) {
                templateDef.preload();
            }
            return templateDef;
        }

        /**
         * @param {Handlebars~context} ctx The context to render the template with
         * @return {string} The rendered template
         */
        render(ctx) { return this._template(ctx); }

        /**
         * @param {Handlebars~context} ctx The context to render the template with
         * @return {jQuery} The rendered template, as a jQuery object
         */
        renderElem(ctx) {
            const rendered = this.render(ctx);
            return $(rendered);
        }

        /**
         * @param {jQuery} $parent The element to insert the rendered template into
         * @param {Handlebars~context} ctx The context to render the template with
         * @param {boolean} [append=false] If true, the rendered template will be {@link jQuery#append}ed to the
         *         parent. If false, the entire inner HTML will be replaced
         */
        renderInto($parent, ctx, append) {
            const rendered = this.render(ctx);
            if (append === true) {
                $parent.append(rendered);
            } else {
                $parent.html(rendered);
            }
        }
    }

    /** @type {Map<string, Template.Def>} */
    const templateDefCache = new Map();

    /**
     * @param {string} name
     * @param {string[]} partials
     * @return {Promise<Handlebars~template>} A {@link Promise} to load the specified template and register the
     *         specified partials before resolving to the loaded template
     */
    function fetchHandlebarsTemplateWithRequiredPartials(name, partials) {
        /** @type {(Promise<Handlebars~partial>|Promise<Handlebars~template>)[]} */
        const promises = partials.map(fetchHandlebarsPartial);
        promises.push(fetchHandlebarsTemplate(name));

        return Promise.all(promises)
                .then(results => results.pop());
    }

    /**
     * @param {string} name
     * @return {Promise<Handlebars~template>}
     */
    function fetchHandlebarsTemplate(name) {
        return fetchHandlebarsSource("/template/" + name + ".hbs")
                .then(source => Handlebars.compile(source));
    }

    /**
     * @param {string} name
     * @return {Promise<Handlebars~partial>}
     */
    function fetchHandlebarsPartial(name) {
        return fetchHandlebarsSource("/template/partial/" + name + ".hbs")
                .then(source => Handlebars.registerPartial(name, source));
    }

    /**
     * @param {string} path
     * @return {Promise<string>}
     */
    function fetchHandlebarsSource(path) {
        return $.ajax({
            url: path,
            method: "GET",
            accepts: { handlebarstemplate: "text/x-handlebars-template;charset=UTF-8" },
            converters: { "text handlebarstemplate": window.String },
            dataType: "handlebarstemplate"
        });
    }

    function validateName(name, isPartial) {
        const illegalChars = ["/", "\\", "."];
        const illegalChar = illegalChars.find(it => name.indexOf(it) !== -1);
        if (illegalChar !== undefined) {
            const msg = (isPartial ? "Partial" : "Template") +
                    " name is illegal as it contains '" + illegalChar + "': " + name;
            throw new Error(msg);
        }
    }

    /**
     * @param {?T[]} arr1
     * @param {?T[]} arr2
     * @return {boolean}
     * @template T
     */
    function shallowArrayEquals(arr1, arr2) {
        if (arr1 == null && arr2 == null) {
            return true;
        }
        if (arr1 == null || arr2 == null) {
            return false;
        }
        if (arr1.length !== arr2.length) {
            return false;
        }
        return arr1.every(it => arr2.includes(it));
    }

    Template.Def = TemplateDef;
    return Template;

    /** @typedef {Object} Handlebars~context */
    /** @typedef {undefined} Handlebars~partial */
    /** @typedef {function(Handlebars~context):string} Handlebars~template */

    /**
     * @callback Template~onTemplateResolved
     * @param {Template} tmpl
     * @return {undefined}
     */
});
