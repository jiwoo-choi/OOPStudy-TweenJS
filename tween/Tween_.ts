// javascript를 타입스크립트로 임포트했습니다.

// https://refactoring.guru/design-patterns/decorator/typescript/example
// https://johngrib.github.io/wiki/decorator-pattern/
interface Timing {
    start: number;
    end: number;
    breakpoint? :number;
}

type Easing =  "EASING";

interface KeyframeAttribute {
    values?: [number, number];
    timing?: Timing;
    easing?: Easing;
}

interface ElementAnimationAttribute extends KeyframeAttribute {
    attributeOnLayoutChanged?: ()=>{};
}

interface SceneAnimationATtribute extends ElementAnimationAttribute {
    heightOnLayoutChanged?: ()=>{};
    timingOnLayoutChanged?: ()=>{};
}

interface TweenElement<T extends TweenViewElement<unknown,K>, K extends KeyframeAttribute>{
    getViewElement(): T
    getAnimations(): Array<K>
}

interface TweenViewElement<T,K extends KeyframeAttribute> extends TweenElement<TweenViewElement<T,K>,K>{
    setAnimations(animations:Array<K>):void;
}

abstract class TweenAnimationAttachable<T extends TweenViewElement<unknown,K>, K extends KeyframeAttribute> implements TweenElement<T,K> {
    
    anyElement : TweenElement<T,K> 
    attribute: K

    constructor(anyElement: TweenElement<T,K>, attribute:K){
        this.anyElement = anyElement;
        this.attribute = attribute;
    }

    getViewElement(): T {
        return this.anyElement.getViewElement();
    }

    getAnimations(): K[] {
        const animations = this.anyElement.getAnimations();
        animations.push(this.attribute);
        return animations;
    }

    ready<C extends T>(): C {
        const viewElement = this.getViewElement();
        const animations = this.getAnimations();
        viewElement.setAnimations(animations);
        return viewElement as C;
    }
}


/** HTML 전용  */
interface TweenHTMLElement extends TweenElement<TweenHTMLViewElement, ElementAnimationAttribute> {
}

interface TweenHTMLViewElement extends TweenViewElement<HTMLElement,ElementAnimationAttribute>  {
    setAnimations(animations:Array<ElementAnimationAttribute>):void;
    getHTMLElement():HTMLElement;
}

abstract class TweenHTMLAnimationAttachable extends TweenAnimationAttachable<TweenHTMLViewElement, ElementAnimationAttribute> {
}

/** 구현체  */

class TweenDIVElement implements TweenHTMLViewElement {

    private animations:ElementAnimationAttribute[];
    private HTMLElement:HTMLElement;

    constructor(tag : string) {
        this.HTMLElement = document.querySelector(tag);
        if (!this.HTMLElement) {
            throw new Error(`${tag} is not HTML Element.`)
        }
    }

    getHTMLElement(): HTMLElement {
        return this.HTMLElement;
    }

    setAnimations(animations: ElementAnimationAttribute[]): void {
        this.animations = animations;
    }

    getViewElement(): TweenDIVElement {
        return this;
    }

    getAnimations(): ElementAnimationAttribute[] {
        if (!this.animations) {
            this.animations = [];
        }
        return this.animations;
    }
}


class TweenCSSAnimation extends TweenHTMLAnimationAttachable {
    
    constructor(anyElement:TweenHTMLElement, attribute: ElementAnimationAttribute){
        super(anyElement, attribute);
    }

    
}

let abc = new TweenDIVElement("body");
let bcd = new TweenCSSAnimation(abc, {});
let abcv = new TweenCSSAnimation(bcd, {});
abc = abcv.ready<TweenDIVElement>();

console.log(abc);
