// javascript를 타입스크립트로 임포트했습니다.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TweenAnimationAttachable = /** @class */ (function () {
    function TweenAnimationAttachable(anyElement, attribute) {
        this.anyElement = anyElement;
        this.attribute = attribute;
    }
    TweenAnimationAttachable.prototype.getViewElement = function () {
        return this.anyElement.getViewElement();
    };
    TweenAnimationAttachable.prototype.getAnimations = function () {
        var animations = this.anyElement.getAnimations();
        animations.push(this.attribute);
        return animations;
    };
    TweenAnimationAttachable.prototype.ready = function () {
        var viewElement = this.getViewElement();
        var animations = this.getAnimations();
        viewElement.setAnimations(animations);
        return viewElement;
    };
    return TweenAnimationAttachable;
}());
var TweenHTMLAnimationAttachable = /** @class */ (function (_super) {
    __extends(TweenHTMLAnimationAttachable, _super);
    function TweenHTMLAnimationAttachable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TweenHTMLAnimationAttachable;
}(TweenAnimationAttachable));
/** 구현체  */
var TweenDIVElement = /** @class */ (function () {
    function TweenDIVElement(tag) {
        this.HTMLElement = document.querySelector(tag);
        if (!this.HTMLElement) {
            throw new Error(tag + " is not HTML Element.");
        }
    }
    TweenDIVElement.prototype.getHTMLElement = function () {
        throw new Error("Method not implemented.");
    };
    TweenDIVElement.prototype.setAnimations = function (animations) {
        this.animations = animations;
    };
    TweenDIVElement.prototype.getViewElement = function () {
        return this;
    };
    TweenDIVElement.prototype.getAnimations = function () {
        if (!this.animations) {
            this.animations = [];
        }
        return this.animations;
    };
    return TweenDIVElement;
}());
var TweenCSSAnimation = /** @class */ (function (_super) {
    __extends(TweenCSSAnimation, _super);
    function TweenCSSAnimation(anyElement, attribute) {
        return _super.call(this, anyElement, attribute) || this;
    }
    return TweenCSSAnimation;
}(TweenHTMLAnimationAttachable));
var abc = new TweenDIVElement("body");
var bcd = new TweenCSSAnimation(abc, {});
var abcv = new TweenCSSAnimation(bcd, {});
abc = abcv.ready();
console.log(abc);
