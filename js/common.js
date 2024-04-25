// 获取dom元素的共通方法

/**
 * 任意查询一个dom元素
 * @param {String} selector 
 * @returns 
 */
function $(selector) {
    return document.querySelector(selector);
}

/**
 * 任意查询一组dom元素
 * @param {String} selector 
 * @returns 
 */
function $$(selector) {
    return document.querySelectorAll(selector);
}