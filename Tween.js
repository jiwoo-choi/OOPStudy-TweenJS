/**
 * CSS코드 적용에 따른 애니메이션 타입 분류.
 * @readonly
 * @enum {string}
 */
const CSSAnimationType = {
  OPACITY: 'OPACITY',
  TRANSLATE3D: 'TRANSLATE3D',
};

/**
 * Canvas엘리먼트 적용에 따른 애니메이션 타입 분류.
 * @readonly
 * @enum {string}
 */
const CavnasAnimationType = {
  DRAWIMAGE: 'DRAWIMAGE',
  CANVAS_FILLRECT: 'CANVAS_FILLRECT',
  CANVAS_FILLRECT_X: 'CANVAS_FILLRECT_X',
  CANVAS_FILLRECT_Y: 'CANVAS_FILLRECT_Y',
  CANVAS_FILLRECT_OPACITY: 'CANVAS_FILLRECT_OPACITY',
}

/**
 * @readonly
 * @enum {string}
 */
const WebAnimationType = {
  canvas: "canvas",
  css: "css",
}

/**
 * Easing 종류를 관리합니다.
 * @readonly
 * @enum {string}
 */
const EasingType = {
  EASEIN: 'EASEIN',
  EASEOUT: 'EASEOUT',
  EASEINOUT: 'EASEINOUT',
};

function CALCENGINE(t, b, c, type) {
  switch (type) {
    case EasingType.EASEIN:
      t /= 1;
      return c * t * t * t + b;
    case EasingType.EASEOUT:
      t /= 1;
      t--;
      return c * (t * t * t + 1) + b;
    case EasingType.EASEINOUT:
      t /= 1 / 2;
      if (t < 1) return (c / 2) * t * t * t + b;
      t -= 2;
      return (c / 2) * (t * t * t + 2) + b;
    default:
      /// Linear!
      return t * c + b;
  }
}
/**
  *
  * @abstract
  * TweenElement를 관리하는 최상위 추상 클래스입니다.
  * 이론상으론 모바일, 웹 어떤 플랫폼이든 사용할 수 있어야 하며, 이 클래스 외부에서 그 속성을 결정합니다.
  */
class TweenElement {
  constructor(viewElement) {
    this._viewElement = viewElement; /// 실질적으로 사용자가 보는 "뷰" 와 관련된 엘리먼트. 뷰와 관련된 클래스의 객체가 들어갈 부분입니다.
    this._animations = []; /// 애니메이션 객체들이 들어갈 Array들 입니다.
  }

  _setAnimations(animations) {
    this._animations = animations;
  }

  _setViewElement(element) {
    if (element) {
      this._viewElement = element;
    } else {
      new Error('Element is undefined.');
    }
  }

  _getViewElement() {
    return this._viewElement;
  }

  updateLayout() {
  }

  /**
   * @return {TweenCSSAnimationAttribute}
   */
  getAnimations() {
    return this._animations;
  }

  getElementClass() {
    return this;
  }
}

/**
  *
  * @abstract
  * TweenElement 타입이지만 HTML-DIV 속성을 사용한다는 의미의 구현클래스입니다.
  */
class TweenDivElement extends TweenElement {
  constructor(tag) {
    super(document.querySelector(tag));
  }

  updateLayout() {
    const animations = this.getAnimations();
    animations.forEach((value) => {
      if (value.attributeOnLayoutChanged) {
        // To-do : muted , chabge the structure
        const copiedAnimationValue = { ...value };
        value = { ...value.attributeOnLayoutChanged(copiedAnimationValue) };
      }
    });
  }
}

/**
 * Canvas Element에서 image source를 패턴으로 넣을경우 사용할 속성을 지정해주는 타입입니다.
 * @typedef SourcePatternAttribute
 * @property {number} start - 시작 숫자.
 * @property {number} end - 끝 숫자.
 * @property {number} [step=1] - 숫자 증가량.
 * @property {string} [zeroPadding] - `"000"`같은 패딩이 있을때 사용합니다.
 */

/**
 * Canvas Element에서 Source를 받을떄 사용하는 타입입니다.
 * @typedef Source
 * @property {Array<string>|string} path - path입니다. 경로를 직접 넣어줄경우 array에 넣고, 패턴형 `${pattern}`으로 넣어줄경우에는 string으로 넣어주세요.
 * @property {SourcePatternAttribute} [sourceAttribute] - source가 패턴일경우에는 pattern attribute도 넣어줘야합니다.
 */

/**
  * HTML-CSSAnimation이 아닌 HTML5-CANVAS 캔버스를 다룰때 사용하는 구현클래스입니다.
  */
class TweenCanvasElement extends TweenElement {
  /**
   *
   * @param {string} tag
   * @param {Source} source
   */
  constructor(tag, source) {
    // View Element 입력.
    super(document.querySelector(tag));
    this.context = this._viewElement.getContext('2d');

    /** @type {"automatic"|"height"|"width"} */
    this.fitType = '';

    /// 이미지 폴더.
    this.images = [];

    /// 가로 세로 정보.
    this.width = this._viewElement.width;
    this.height = this._viewElement.height;

    if (source) {
      /// 소스가 있는 경우.
      if (!Array.isArray(source.path)) {
        /// path를 패턴으로 입력한경우.
        const sourcePart1 = source.path.split('${')[0];
        const sourcePart2 = source.path.split('}')[1];
        const { start } = source.sourceAttribute;
        const { end } = source.sourceAttribute;
        const step = (source.sourceAttribute.step) ? source.sourceAttribute.step : 1;
        const zeroPadding = (source.sourceAttribute.zeroPadding) ? source.sourceAttribute.zeroPadding : '';

        for (let i = 0; i < end - start + 1; i += step) {
          const imgElem = new Image();
          let value;
          if (zeroPadding) {
            value = (zeroPadding + (i + start)).substr(-zeroPadding.length, zeroPadding.length);
          } else {
            value = i + start;
          }
          imgElem.src = `${sourcePart1.concat(`${value}`).concat(sourcePart2)}`;
          this.images.push(imgElem);
        }
      } else if (source && source.path) {
        // 패턴으로 입력한게 아니라, 직접 경로를 입력한경우.
        const imgElem = new Image();
        for (let i = 0; i < source.path.length; i++) {
          imgElem.src = source.path[i];
        }
        this.images.push(imgElem);
      } else {
        // 소스가 없는경우.
      }
    }
  }

  updateLayout() {
    // if (this.scaleOnLayoutChanged){
    //   const {width, height} = this.scaleOnLayoutChanged();
    //   this._viewElement.style.width = this.width = width;
    //   this._viewElement.style.height = this.height = height;
    // }

    if (this.fitType) {
      const widthRatio = window.innerWidth / this.width;
      const heightRatio = window.innerHeight / this.height;

      switch (this.fitType) {
        default:
        case 'automatic':
          if (widthRatio <= heightRatio) {
            this.scaleRatio = heightRatio;
          } else {
            this.scaleRatio = widthRatio;
          }
          break;
        case 'height':
          this.scaleRatio = heightRatio;
          break;
        case 'width':
          this.scaleRatio = widthRatio;
          break;
      }

      // TO-DO: center 방식 고정해야함.
      this._viewElement.style.transform = `translate3d(-50%,-50%,0) scale(${this.scaleRatio})`;
    }

    /**
     * TO-DO : 그리기속성 애니메이션 만들기. draw(); 해서 첫번째꺼 그릴 수 있게 하자. 레이아웃이 바뀔떄.
     */

    // 일반애니메이션 캔버스 애니메이션 둘다 올 수 있습니다.
    // CanvasAnimationAttribute, CSSAnimationAttribute
    /** @type {} */
    const animations = this.getAnimations();
    animations.forEach((value) => {
      if (value.attributeOnLayoutChanged) {
        const copiedAnimationValue = { ...value, scaleRatio: this.scaleRatio };
        value = { ...value.attributeOnLayoutChanged(copiedAnimationValue) };
      }
    });
  }

  setAutomaticFit() {
    this.fitType = 'automatic';
  }

  setHighetFit() {
    this.fitType = 'height';
  }

  setWidthFit() {
    this.fitType = 'width';
  }

  setThumbnail() {
    if (this.images[0]) {
      this.context.drawImage(this.images[0], 0, 0);
    } else {
      // if it is just drawing?
      // this._canvasAnimation;
      // draw it!
    }
  }

  setFillStyle(style) {
    this.context.fillStyle = style;
  }

  clearRect() {
    this.context.clearRect(0, 0, this.width, this.height);
  }
}

/**
   * @abstract
   * 데코레이터 패턴을 위한 추상 클래스입니다.
   * 이 클래스를 상속받으면, 트윈 엘리먼트에 접합할 수 있습니다.
   */
class TweenElementAttachable extends TweenElement {
  constructor(element, attribute) {
    super();
    this.tweenElement = element;
    this.attribute = attribute;
  }

  /**
     * @abstract
     */
  getAnimations() {
    this.attribute.attributeOnLayoutChanged = this._attributeOnLayoutChanged;
    const animationArray = this.tweenElement.getAnimations();
    animationArray.push({...this.attribute});
    return animationArray;
  }

  /**
     * @abstract
     */
  getElementClass() {
    return this.tweenElement.getElementClass();
  }

  setAttributeonLayoutChanged(callbackFn) {
    this._attributeOnLayoutChanged = callbackFn;
  }

  /**
     * @abstract
     */
  ready() {
    const animations = this.getAnimations();
    const element = this.getElementClass();
    element._setAnimations(animations);
    return element;
  }
}

/**
 * @callback CSSAttributeOnLayoutChanged
 * @param {TweenCSSAnimationAttribute} currentCSSAnimationAttribute - 현재 attribute
 * @return {TweenCSSAnimationAttribute}
 */

/**
 * @typedef {Object} TweenCSSAnimationAttribute
 * @property {WebAnimationType} type - 웹 애니메이션 대분류.
 * @property {!CSSAnimationType} animationType - 애니메이션 액션에 대한 유형을 담아놓습니다. 어떤 CSSCode를 써야하는가?
 * @property {!Array<number>} values - 시작값과 끝값을 담는 array입니다.
 * @property {?EasingType} [easing] - easeing
 * @property {CSSAttributeOnLayoutChanged} attributeOnLayoutChanged
 */

/**
 * TweenCSSAnimation은 CSS 애니메이션이나 속성을 활용하는 구현클래스입니다.
 * Attribute는 필요없이 이친구가 가지고있도록합시다.
 */
class TweenCSSAnimation extends TweenElementAttachable {
  /**
   *
   * @param {TweenElement} tweenElement
   * @param {TweenCSSAnimationAttribute} attribute
   */
  constructor(tweenElement, attribute) {
    super(tweenElement, attribute);
  }

  /** TO-DO 어떻게나눌것인가? */
  /** To-Do attribute가 상속되어야한다.  { attribute &  } */
}

/**
 * @callback CanvasAttributeOnLayoutChanged
 * @param {TweenCanvasAnimationAttribute} currentCanvasAnimationAttribute - 현재 attribute
 * @return {TweenCanvasAnimationAttribute}
 */

/**
 * @typedef {Object} CanvasDrawingDimension 캔버스를 그릴때의 값들을 셋팅할 Attribute입니다.
 * @property {?number|string} x x 좌표
 * @property {?number|string} y y 좌표
 * @property {?number|string} width 가로 길이
 * @property {?number|string} height 세로 길이
 */

/**
 * @typedef {Object} TweenCanvasAnimationAttribute
 * @property {WebAnimationType} type - 웹 애니메이션 대분류.
 * @property {!CavnasAnimationType} animationType - 애니메이션 액션에 대한 유형을 담아놓습니다. 어떤 CSSCode를 써야하는가?
 * @property {!Array<number>} values - 시작값과 끝값을 담는 array입니다.
 * @property {?EasingType} [easing] - easeing
 * @property {CanvasDrawingDimension} canvasDrawingDimension
 * @property {CanvasAttributeOnLayoutChanged} attributeOnLayoutChanged
 * @property {number} scaleRatio
 * @property {string} fillStyle
 */

class TweenCanvasAnimation extends TweenElementAttachable {
  /**
   *
   * @param {TweenElement} tweenElement
   * @param {TweenCanvasAnimationAttribute} attribute
   */
  constructor(tweenElement, attribute) {
    super(tweenElement, attribute);
  }

  /** TO-Do fill style처리, 그리고 상속관계 - sorted 처리 */
  setFillStyle(style) {
    this.attribute.fillStyle = style;
  }

}

const TweenCSSAnimationFactory = {

  /**
   * @param  {TweenElement} element
   * @param  {TweenCSSAnimationAttribute} attribute
   * @return {TweenCSSAnimation}
   */
  FadeIn: (element, attribute) => {
    attribute.type = WebAnimationType.css;
    attribute.animationType = CSSAnimationType.OPACITY;
    new TweenCSSAnimation(element, attribute)
  },

   /**
   * @param  {TweenElement} element
   * @param  {TweenCSSAnimationAttribute} attribute
   * @return {TweenCSSAnimation}
   */
  FadeOut: (element, attribute) => {
    attribute.type = WebAnimationType.css;
    attribute.animationType = CSSAnimationType.OPACITY;
    new TweenCSSAnimation(element, attribute)
  },
  
  /**
   * @param  {TweenElement} element
   * @param  {TweenCSSAnimationAttribute} attribute
   * @return {TweenCSSAnimation}
  */
  MoveY: (element, attribute) => {
    /** TO-DO : Translate. */
    attribute.type = WebAnimationType.css;
    attribute.animationType = CSSAnimationType.TRANSLATE3D;
    new TweenCSSAnimation(element, attribute)
  }
};


const TweenCanvasAnimationFactory = {
  /**
     * @param  {TweenElement} element
     * @param  {TweenCanvasAnimationAttribute} attribute
     * @return {TweenCanvasAnimation}
     */
  DrawingRectX: (element, attribute = {}) => {
    attribute.animationType = CavnasAnimationType.CANVAS_FILLRECT_X
    attribute.type = WebAnimationType.canvas
    return new TweenCanvasAnimation(element, attribute)
  },

  /**
   * @param  {TweenElement} element
   * @param  {TweenCanvasAnimationAttribute} attribute
   * @return {TweenCanvasAnimation}
   */
  DrawingRectY: (element, attribute = {}) => {
    attribute.animationType = CavnasAnimationType.CANVAS_FILLRECT_Y
    attribute.type = WebAnimationType.canvas
    return new TweenCanvasAnimation(element, attribute)
  },

  /**
   * @param  {TweenElement} element
   * @param  {TweenCanvasAnimationAttribute} attribute
   * @return {TweenCanvasAnimation}
   */
  DrawingRect: (element, attribute = {}) => {
    attribute.animationType = CavnasAnimationType.CANVAS_FILLRECT
    attribute.type = WebAnimationType.canvas
    return new TweenCanvasAnimation(element, attribute)
  },

  /**
   * @param  {TweenElement} element
   * @param  {TweenCanvasAnimationAttribute} attribute
   * @return {TweenCanvasAnimation}
   */
  DrawingFadeOut: (element, attribute = {}) => {
    /** To-Do: opacity속성은 겹치면안됨. fade-in이 나오면 안됨. */
    /** fadein - fadeout 하면 겹쳐서안됨 breakpoint 가 필요함.  */
    attribute.animationType = CavnasAnimationType.CANVAS_FILLRECT_OPACITY
    attribute.type = WebAnimationType.canvas
    attribute.values = [1,0]
    return new TweenCanvasAnimation(element, attribute)
  }


}



/**
 * 타이밍에 대한 타입입니다. Attribute에 추가될것입니다.
 * @typedef {{start:number, end:number, breakpoint:number}} Timing
 * */

class SceneBuilder {
  constructor(tag, ...tweenElements) {
    this.tag = tag;
    this.tweenElements = tweenElements;

    this.tweenElements.forEach((value, index) => {
      if (value instanceof TweenCSSAnimation) throw new Error(`${index}th TweenElement is not ready. please call ready()`);
    });

    this.elementIndex = 0;
    this.animationIndex = 0;
    this.processed = 0;
    this.length = undefined;
  }

  setTiming(timing = { start: 0, end: 0 }) {
    if (!this.tweenElements.length) {
      return this;
    }

    if (this.elementIndex >= this.tweenElements.length && this.tweenElements.length !== 0) {
      throw new Error('All tween elements are already set');
    }
    if (this.animationIndex >= this.tweenElements[this.elementIndex].getAnimations().length) {
      throw new Error('All animation timing are already set');
    }

    Object.assign(this.tweenElements[this.elementIndex].getAnimations()[this.animationIndex], { timing });
    this.animationIndex++;

    if (this.animationIndex === this.tweenElements[this.elementIndex].getAnimations().length) {
      this.animationIndex = 0;
      this.elementIndex++;
    }
    this.processed++;

    return this;
  }

  /**
     *
     * @callback callbackTimeOnLayoutChanged
     * @param {Timing} prevTiming
     * @param {TweenElement} currentTween
     * @param {TweenCSSAnimationAttribute} currentAnimation
     * @return {Timing}
     */

  /**
     *
     * @param {callbackTimeOnLayoutChanged} callbackTimeOnLayoutChangedCB
     * @param {Timing} defaultTiming
     */
  setTimingOnLayoutChanged(callbackTimeOnLayoutChangedCB, defaultTiming = { start: 0, end: 0 }) {
    if (!this.tweenElements.length) {
      return this;
    }

    if (this.elementIndex >= this.tweenElements.length && this.tweenElements.length !== 0) {
      throw new Error('All tween elements are already set');
    }

    if (this.animationIndex >= this.tweenElements[this.elementIndex].getAnimations().length) {
      throw new Error('All animation timing are already set');
    }

    Object.assign(this.tweenElements[this.elementIndex].getAnimations()[this.animationIndex], { timing: defaultTiming, timingOnLayoutChanged: callbackTimeOnLayoutChangedCB });
    this.animationIndex++;

    if (this.animationIndex === this.tweenElements[this.elementIndex].getAnimations().length) {
      this.animationIndex = 0;
      this.elementIndex++;
    }
    this.processed++;
    return this;
  }

  setLength(value) {
    this.length = value;
    return this;
  }

  setFitLength() {
    this.length = document.querySelector(this.tag).offsetHeight;
    return this;
  }

  setLengthOnLayoutChanged(callbackFn) {
    this.length = callbackFn;
    return this;
  }

  /**
   * 
   * @param {*} attribute 
   * @param {*} callback 
   */
  extendPlayAnimation(attribute, callback ) {
    this._extendPlayAnimation = callback;
    this._extendAttribute = attribute;
    // element 어떻게할거인지? 
    // timing이 정해지지않는다면 어떻게할것인지? 
    // timimg을 어떻게 정할건지?
    // attribute type?
    /**
     * ( 1. playhead,  2. attribute , 3. calculator) => {
     * 
     *  calculator()
     *  { abc :  } , () => { 
     *    attribute.
     *    abc.Abc
     *    abc.ABC.
     *    objs.context. 
     *    objs.
     * 
     *   }
     * }
     */

     return this;
  }

  build() {
    if (!this.length) {
      throw new Error('length is not set');
    }

    let totalAnimations = 0;
    this.tweenElements.forEach((value) => {
      totalAnimations += value.getAnimations().length;
    });

    if (this.processed !== totalAnimations) {
      throw new Error(`Some Animations is not set. Expected:${totalAnimations} Actual :${this.processed} `);
    }

    return new Scene(this.tag, this.tweenElements, this.length, this._extendPlayAnimation, this._extendAttribute = {});
  }
}

class Scene {
  constructor(tag, tweens, length, extension, extensionAttribute) {
    this.tag = document.querySelector(tag);
    this.tweens = tweens;
    this.index = 0;

    if (typeof length !== 'number') {
      this.length = 0;
      this.lengthUpdater = length;
    } else {
      this.length = length;
    }

    this.extension = extension;
    this.extensionAttribute = extensionAttribute;

    this.sortedTweens = [];
  }

  updateLayout() {

    if (this.lengthUpdater) {
      this.length = this.lengthUpdater();
    }

    this.tweens.forEach((tween) => {
      tween.updateLayout();
      let prevTiming;
      const animations = tween.getAnimations();
      animations.forEach((animation) => {
        if (animation.timingOnLayoutChanged) {
          animation.timing = animation.timingOnLayoutChanged({...prevTiming}, { ...tween }, { ...animation });
        }
        prevTiming = animation.timing;
      });
    });


    /** 정렬과 분배 */
    this.tweens.forEach((tween, index) => {
      
      // 모든 애니메이션이 나옵니다.
      // 1. 애니메이션을 시간에 따라 일단 분류해주고, (시간이 먼저 결정되어야 하거나, 관련이 없는경우가 만흣ㅂ니다. 그 이후에 결정합니다.
      // 2. 이 애니메이션은 여러가지 타입으로 나올 수 있습니다. 
      const animations = tween.getAnimations();
      const sortedAnimationsByFinishTime = animations.sort((a, b) => (a.timing.end < b.timing.end ? -1 : a.timing.end < b.timing.end ? 1 : 0));
      // 3. 애니메이션을 분류해줘야합니다.
      // 3-1. 애니메이션이 캔버스 관련 애니메이션일경우, 
      // 3-2. 애니메이션이 씬 관련 일경우...
      const reducedAnimationsByStyle = sortedAnimationsByFinishTime.reduce((prev, current, index, array) => {

        if (current.type === WebAnimationType.canvas) {
          
          /** @type {TweenCanvasAnimationAttribute & {timing: Timing, timingOnLayoutChanged: callbackTimeOnLayoutChanged}} */
          const canvas = current;
          
          if (prev[WebAnimationType.canvas]) {
            prev[WebAnimationType.canvas].push(canvas)
          } else {
            prev[WebAnimationType.canvas] = [canvas]
          }

        } else if (current.type === WebAnimationType.css) {

          /** @type {TweenCSSAnimationAttribute & {timing: Timing, timingOnLayoutChanged: callbackTimeOnLayoutChanged}} */
          const css = current;

            if (prev[css.cssAnimationType]) {
              const { length } = prev[current.CSSAnimationType];
              const prevElement = prev[current.CSSAnimationType][length - 1];
              const lastend = prevElement.timing.end;
              const newstart = css.timing.start;
              prevElement.timing.breakpoint = (newstart - lastend) / 2 + lastend;
  
              if (array.length - 1 === index) {
                css.timing.breakpoint = 1;
              }
              prev[css.CSSAnimationType].push(css);
            } else {
              prev[css.CSSAnimationType] = [css];
          }  
        } else {
          //nothing.
        }

        return prev;
      }, {});


      this.sortedTweens.push(
        {
          _animations: reducedAnimationsByStyle,
          _viewElement: tween._getViewElement(),
          _viewElementClass: tween.getElementClass(),
        },
      );
    });
  }

  getLength() {
    return this.length;
  }

  playAnimation(playhead) {

    for (let i = 0; i < this.sortedTweens.length; i++) {
      const keys = Object.keys(this.sortedTweens[i]._animations);

      for (const key of keys) {

        if (key === WebAnimationType.canvas) {


          const context = this.sortedTweens[i]._viewElement.getContext('2d');
          // 이부분은 초기화 하는것이 필요합니다..
          //초기화코드.
          // instanceof Classvideo <- 
          // instanceof ClassImage <- 이미지를 그립니다. 
          //instanceOf DrawingElement <- 오직 드로잉만 담당합니다. 기본적인것을 담당합니다.
          context.clearRect(0, 0, this.sortedTweens[i]._viewElement.width, this.sortedTweens[i]._viewElement.height);

          const original = this.sortedTweens[i]._viewElementClass;
          const originalStyle = original.fillStyle;
          //TO-DO : 재사용가능하게만들었다.
          //초기화코드작성하기.
          //do this animation.
          //playthisanimation!
          //timing에 맞추는게아니라 바로 실행할 수 ㅣㅇㅆ도록. 재사용가능하려면

          // context.fillRect(0,0,this.sortedTweens[i]._viewElement.width,this.sortedTweens[i]._viewElement.height);
          // // console.log(context);
          // context.fillStyle = "white";

          this.sortedTweens[i]._animations[WebAnimationType.canvas].forEach( (value) => {

            /** @type {TweenCanvasAnimationAttribute} */
            let tempValue = value;

            // To-Do : attribvute 상속관계 여기서도 증명됨. attribute관한 추상 타입넣어주면(기본필수추상) 알아서해석함. attribute 필수 -> attribuge 선택
            const calculatedValue = this.animationValueRatioReducerWith([tempValue], playhead);
            const demension = tempValue.canvasDrawingDimension;
            const { x, y, height, width } = demension;

            context.fillStyle = 'black';
            //To-Do 초기설정적용.
            // context.save();
            //각각설정적용.
            const style = (tempValue.fillStyle) ? tempValue.fillStyle : originalStyle;

            switch(tempValue.animationType) {
              case CavnasAnimationType.CANVAS_FILLRECT_X:
                context.fillRect(parseInt(calculatedValue), parseInt(y), parseInt(width), parseInt(height));
              break;
              case CavnasAnimationType.CANVAS_FILLRECT_Y:
                context.fillRect(parseInt(x), parseInt(calculatedValue), parseInt(width), parseInt(height));
              break;
              case CavnasAnimationType.CANVAS_FILLRECT:
              break;
              case CavnasAnimationType.CANVAS_FILLRECT_OPACITY:
                // rgba(255, 255, 0, 1)
                context.fillStyle = `rgba(255,255,255,${calculatedValue})`
                // context.fillRect(parseInt(x), parseInt(calculatedValue), parseInt(width), parseInt(height));
                context.fillRect(0, 0, this.sortedTweens[i]._viewElement.width, this.sortedTweens[i]._viewElement.height);
              break;
  
            }})

            context.restore();



        } else {

          const value = this.animationValueRatioReducerWith(this.sortedTweens[i]._animations[key], playhead);
          switch (this.sortedTweens[i]._animations[key][0].animationType) {
            case CSSAnimationType.OPACITY:
              this.sortedTweens[i]._viewElement.style.opacity = value;
              break;
            case CSSAnimationType.TRANSLATE3D:
              this.sortedTweens[i]._viewElement.style.transform = `translate3d(0,${value}%,0)`;
              break;
          }  
        }
      }
    }

    if (this.extension) {
      console.log("hello");
      this.extension(playhead, this.extensionAttribute, this.calcValue);
    }
  }

  /**
     * 순수하게 계산만 해준다. playHead의 값에 따라서 계산만해준다.
     * - 배열 1개당 값 1개만 나옴.
     * @param {} array
     * @param {*} callbackFn
     * @param {*} currentValue
     */

  // to-do: 순수하게 값 계산 말고, tween 엘리먼트를 받아서 애니메이션 onStart불러주게 변경.
  animationValueRatioReducerWith(array, currentValue) {

    for (let i = 0; i < array.length; i++) {

      if (array[i].timing.breakpoint && currentValue > array[i].timing.breakpoint) {
        // 이미 이것의 차례는 지나갔다. (array가 sort되어있기때문에 알수있음)
        continue;
      }
      return this.calcValue(array[i].values, currentValue, array[i].timing, array[i].easing);
    }
  }

  /// 순수함수.
  calcValue(values, currentValue, timing = {start:0, end: 1}, easing) {

      const partScrollStart = timing.start;
      const partScrollEnd = timing.end;
      const partScrollHeight = partScrollEnd - partScrollStart;
  
      const time = (currentValue - partScrollStart) / partScrollHeight;
      const change = values[1] - array[i].values[0];
      const begin = values[0];
      const type = easing;
  
      let ret;
      if (currentValue >= partScrollStart && currentValue <= partScrollEnd) {
        ret = CALCENGINE(time, begin, change, type);
      } else if (currentValue < partScrollStart) {
        ret = values[0];
      } else if (currentValue > partScrollEnd) {
        ret = values[1];
      }
      return ret


  }
}

/**
   *
   * 이 클래스는 전체 씬을 관리합니다.
   * - 전체 씬의 기본값recalculateLength 셋팅을 담당하고 업데이트를 담당합니다.
   */
class Project {
  /**
     *
     * @param  {...Scene} scenes
     */
  constructor() {
    /** @type {...Scene[]} scenes */
    this.scenes = [];
    // binding
    this.updatePlayHead = this.updatePlayhead.bind(this);
    this.setLayout = this.setLayout.bind(this);
    /** 현재 활성화 되어있는 씬입니다. */
    this.currentScene = 0;
    /** 현재 스크롤 된 오프셋입니다. */
    this.yOffset = window.pageYOffset;

    this._afterloadlayout = new Event('afterloadlayout', { bubbles: true });
    this._beforeloadlayout = new Event('beforeloadlayout', { bubbles: true });
  }

  /**
     * 프로젝트에서 필요한 씬들을 로드합니다.
     * 로드 이전에는 프로젝트가 제대로 로드되지않습니다. 반드시 로드를 해야합니다.
     * 로드를 하기위해서는 각 Scene들이 모두 ready가 되어있어야합니다.
     * 로드 된 후에는 `Scene.sync`를 통해 필요자료를 업데이트합니다.
     */
  load(...args) {
    this.scenes = args;
    let total = 0;
    this.scenes.forEach((scene, index) => {
      if (!(scene instanceof Scene)) {
        throw new Error(`${index}th scene is not built.`);
      }
      total += scene.getLength();
    });

    window.addEventListener('scroll', () => {
      this.yOffset = window.pageYOffset;

      if (this.pin && window.pageYOffset >= 0) {
        this.pin.style.transform = `translate3d(${
          (window.pageYOffset / total) * 100
        }%, 0,0)`;
      }

      this.updatePlayhead();
    });

    window.addEventListener('resize', () => {
      this.setLayout();
    });

    window.addEventListener('load', () => {
      if (this.pin && window.pageYOffset >= 0) {
        this.pin.style.transform = `translate3d(${
          (window.pageYOffset / total) * 100
        }%, 0,0)`;
      }

      document.body.dispatchEvent(this._beforeloadlayout);
      this.setLayout();
      document.body.dispatchEvent(this._afterloadlayout);
      // 썸네일?? 어떻게처리할것?
      //
    });

    // const sceneContainerLength = this.scenes.length * 30 + 30;

    // const dummy = window.document.createElement('div');
    // dummy.style.width = '100%';
    // dummy.style.height = `${sceneContainerLength}px`;
    // document.body.appendChild(dummy);

    // const container = window.document.createElement('div');
    // container.style.position = 'fixed';
    // container.style.bottom = '0';
    // container.style.width = '100%';
    // document.body.appendChild(container);

    // const header = window.document.createElement('div');
    // const text = document.createTextNode("Project Timeline");
    // header.style.background = 'rgb(29, 29, 31)';
    // header.style.borderBottom = '1px solid black';
    // header.style.width = '100%';
    // header.style.height = '30px';
    // header.style.color = 'white';
    // header.style.display = 'flex';
    // header.style.alignItems = 'center';
    // header.style.borderRadius = '9px 9px 0 0';
    // header.style.paddingLeft = '10px'
    // container.appendChild(header);
    // header.appendChild(text);

    // const pinContainer = window.document.createElement('div');
    // pinContainer.style.position = 'absolute';
    // pinContainer.style.zIndex = '9';
    // pinContainer.style.height = `${sceneContainerLength-30}px`;
    // pinContainer.style.width = '100%';
    // pinContainer.style.height = '100%';
    // container.appendChild(pinContainer);
    // this.pin = pinContainer;

    // const pin = window.document.createElement('div');
    // pin.style.position = 'relative';
    // pin.style.zIndex = '10';
    // pin.style.height = `${sceneContainerLength-30}px`;
    // pin.style.width = '2px';
    // pin.style.background = 'red';
    // pin.style.top = '0';
    // pinContainer.appendChild(pin);

    // function getRandomColor() {
    //     var letters = '0123456789ABCDEF';
    //     var color = '#';
    //     for (var i = 0; i < 6; i++) {
    //       color += letters[Math.floor(Math.random() * 16)];
    //     }
    //     return color;
    //   }

    // let previous = 0;
    // this.scenes.forEach((value, index) => {

    //     const sceneContainer = window.document.createElement('div');
    //     sceneContainer.style.background = 'rgb(29, 29, 31)';
    //     sceneContainer.style.borderBottom = '1px solid black';
    //     sceneContainer.style.width = '100%';
    //     container.appendChild(sceneContainer);

    //     const scene = window.document.createElement('div');
    //     scene.style.position = 'relative';
    //     scene.style.background = getRandomColor();
    //     scene.style.width = `${value.getLength()/total * 100}%`;
    //     scene.style.height = '30px';
    //     scene.style.left = `${previous}%`;
    //     previous += value.getLength()/total * 100;
    //     sceneContainer.appendChild(scene);
    // })

    // var scene1 = window.document.createElement('div');
    // scene1.style.background = 'red';
    // scene1.style.width = '100%';
    // scene1.style.height = '20px';

    // var scene2 = window.document.createElement('div');
    // scene2.style.background = 'green';
    // scene2.style.width = '100%';
    // scene2.style.height = '20px';

    // container.appendChild(scene);
    // container.appendChild(scene1);
    // container.appendChild(scene2);
  }

  /**
     * 현재 스크롤에 따라 플레이 헤드를 업데이트해줍니다..
     * - 현재 활성화해야하는 Scene을 보여줍니다. //shouldupdate?
     * - 현재 활성화해야하는 Scene들도 보여줍니다.
     */
  updatePlayhead() {
    if (!this.scenes[this.currentScene]) {
      console.log('some section is not set');
      return;
    }

    /** 새로운 씬에 들어갔을때 이 플래그가 바뀝니다. */
    let enterNewScene = false;
    this.prevSceneLengths = 0;

    // `prevSceneLengths`를 통해 지금까지 지나친 Scenes들을 파악한다..
    for (let i = 0; i < this.currentScene; i++) {
      this.prevSceneLengths += this.scenes[i].getLength();
    }

    // 만약 현재가 지금까지 지나친 총 length에다가 현재 scene의 length보다 더 높다면, 현재 씬을 넘어간것이다.
    // currentScene이 있는데 scene이 없다면 그건 또 문제다.
    if (
      this.yOffset > this.prevSceneLengths + this.scenes[this.currentScene].getLength()
    ) {
      this.currentScene++;
      enterNewScene = true;
      document.body.setAttribute('id', `show-scene-${this.currentScene}`);
    }

    if (this.yOffset < this.prevSceneLengths) {
      // 첫번째 씬의경우 줄어들일이 없다.
      if (this.currentScene === 0) return;

      this.currentScene--;
      enterNewScene = true;
      document.body.setAttribute('id', `show-scene-${this.currentScene}`);
    }

    // if (this.currentScene === 0) {
    //     //0이라면
    //     const loaded = this.scenes[this.currentScene]._onSceneLoaded;
    //     if (loaded) {
    //         loaded();
    //     }
    // }

    // 한번에 그려줘야하고
    // 한번에 계산해줘야함.

    if (enterNewScene) {
      // 새로운 Scene에 들어갔을대

    } else {
      const currentYOffsetAtScene = this.yOffset - this.prevSceneLengths;
      const scrollRatio = currentYOffsetAtScene / this.scenes[this.currentScene].getLength();
      this.scenes[this.currentScene].playAnimation(scrollRatio);
    }
  }

  /**
     * 브라우저의 창이 변경되었을때 레이아웃 상태를 변경해주는 함수입니다.
     */
  setLayout(fnc) {
    // 모든것을 업데이트하라
    for (let i = 0; i < this.scenes.length; i++) {
      this.scenes[i].updateLayout();
    }

    for (let i = 0; i < this.scenes.length; i++) {
      this.scenes[i].tag.style.height = `${this.scenes[i].getLength()}px`;
    }

    // this._dynamic_multipleLength(innerWidth).getLength();
    // recalculate..?

    // 현재 currentScene이 어딘지 파악합니다.
    let totalScreenHeight = 0;
    for (let i = 0; i < this.scenes.length; i++) {
      totalScreenHeight += this.scenes[i].getLength();
      if (totalScreenHeight >= window.pageYOffset) {
        this.currentScene = i;
        break;
      }
    }

    document.body.setAttribute('id', `show-scene-${this.currentScene}`);
  }
}

