import {MDCTabBar} from '@material/tab-bar';
import {MDCTopAppBar} from '@material/top-app-bar';
import './app-icon-dark.png';
import './app-icon-light.png';

function onLoad() {
    new MDCTopAppBar(document.querySelector('#aik-top-app-bar'));
    new MDCTabBar(document.querySelector('#aik-top-tab-bar'));
}

window.addEventListener('load', onLoad, false);
