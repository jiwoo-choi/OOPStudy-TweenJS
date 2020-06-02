/**
 * CSS코드 적용에 따른 타입 분류.
 * @readonly
 * @enum {string}
 */
var CSSType = {
    OPACITY: "OPACITY",
    TRANSLATE3D : "TRANSLATE3D",
    DRAWIMAGE : "DRAWIMAGE",
    FILLRECT : "FILLRECT",
  }
  
  /**
   * Animation의 종류에 따른 타입 분류.
   * @readonly
   * @enum {string}
   */
  var AnimationType = {
    FADEIN : "FACEIN",
    FADEOUT : "FADEOUT",
    MOVEUP : "MOVEUP",
    MOVEDOWN : "MOVEDOWN",
  }
  
  /**
   * EASEing 종류를 관리합니다.
   * @readonly
   * @enum {string}
   */
  var EasingType = {
    EASEIN: "EASEIN",
    EASEOUT: "EASEOUT",
    EASEINOUT: "EASEINOUT",
  };
  
  function CALCENGINE (t, b, c, type) {
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
   * @typedef {Object} TweenAnimationAttribute
   * @property {!CSSType} CSSType - 애니메이션 액션에 대한 유형을 담아놓습니다. 어떤 CSSCode를 써야하는가? 
   * @property {!Array<number>} values - 시작값과 끝값을 담는 array입니다.
   * @property {?EasingType} [easing] - easeing
   */
  
  
  class TweenElement {
  
      constructor(){
        // this._tag = document.querySelector(tag);
        // this._tag = ""
        this._element; /// 뷰와 관련된 엘리먼트.
        this._animations = []; /// 애니메이션.
      }
  
      /**
       * 
       * @param {TweenAnimationAttribute} attribute 
       */
      _addAnimation(attribute){
        // this._animations[attribute.CSSType] = attribute;
        this._animations.push(attribute);
      }
  
      _setAnimations(animations){
        this._animations = animations;
      }
  
      _setElement(element) { 
        this._element = element;
      }
  
      _getElement(){
        return this._element;
      }
  
      /**
       * 예외적으로 구현되어있는 케이스.
       */
      updateLayout(){
        const animations = this.getAnimations();
        animations.forEach((value) => {
          if(value.onLayoutChanged) {
            value = value.onLayoutChanged(this._element, Object.assign({},value))
          }
        })
      }
  
      /**
       * @return {TweenAnimationAttribute}
       */
      getAnimations(){
        return this._animations;
      }
  
      getElementClass(){
        return this;
      }
  
  }
  
  
  class TweenElementAttachable extends TweenElement{ // CondimentDecorator
    /**
     * @abstract 
     */
    getAnimations(){
    }
  
    /**
     * @abstract
     */
    getElementClass(){
    }
  
    /**
     * @abstract
     */
    ready(){
    }
  
  }
  
  class TweenAnimation extends TweenElementAttachable { 
  
    /**
     * @param {TweenElement} element 
     * @param {TweenAnimationAttribute} attribute 
     */
    constructor(element, attribute) {
      super();
      // 엘리먼트 타입은 TweenElement입니다.
      /** @type {TweenElement} */
      this.element = element; /// 트윈속성 엘리먼트 클래스. "뷰 엘리먼트가 아님"
      /** @type {TweenAnimationAttribute} */
      this.attribute = attribute;
    }
    
    /**
     * @override
     */
    getAnimations(){ //getDescrtipion
      let animationArray = this.element.getAnimations()
      Object.assign(this.attribute, {onLayoutChanged: this._onLayoutChanged, onStart: this._onStart, onEnd: this._onEnd})
      animationArray.push(this.attribute);  
      return animationArray;
    }
  
    getElementClass(){
      return this.element.getElementClass();
    }
  
    /** 
    * AnimationCallBack 형식입니다.
    * @callback AttributeCallbackFn
    * @param {HTMLElement} tag - html태그
    * @param {TweenAnimationAttribute} attribute
    * @returns {TweenAnimationAttribute}
    */
  
    /**
     * @param {AttributeCallbackFn} callbackFn 
     */
     onStart(callbackFn){
      this._onStart = callbackFn;
      // to-do : scene에서 타이밍 정하는법
    }
  
    /**
     * @param {AttributeCallbackFn} callbackFn 
     */
    onEnd(callbackFn){
      this._onEnd = callbackFn;
        // to-do : scene에서 타이밍 정하는법
    }
  
    /**
     * @param {AttributeCallbackFn} callbackFn 
     */
    onLayoutChanged(callbackFn) {
      this._onLayoutChanged = callbackFn;
    }
  
  
    /**
     * 이 함수는 모든 애니메이션 값을 TweenElement를 상속하는 기반클래스의 `_animations`에 저장시키고 그 객체를 반환합니다. 
     * @return {TweenElement}
     */
    ready(){
      const animations = this.getAnimations();
      /** @type {TweenElement} */
      const element = this.getElementClass();
      element._setAnimations(animations);
      // TO-DO : 
      //혹은 마지막에다가 _element,와 _animations를 저장하는 방법도 있음.
      // this = element;
      return element
    }
  
  }
  
  
  /**
   * Returns a coordinate from a given mouse or touch event
   * @param  {AnimationType} type
   * @param  {TweenElement} element
   * @param  {TweenAnimationAttribute} values
   * @return {TweenAnimation} 
   */
  var TweenAnimationFactory = {
  
    /**
     * @param  {TweenElement} element
     * @param  {EasingType} easing
     * @return {TweenAnimation} 
     */ 
    FadeIn: (element) => {
      return new TweenAnimation(element, { CSSType:CSSType.OPACITY , values : [0,1] })
    },
  
    /**
     * @param  {TweenElement} element
     * @param  {EasingType} easing
     * @return {TweenAnimation} 
     */ 
    FadeOut: (element) => {
      return new TweenAnimation(element, { CSSType:CSSType.OPACITY , values : [1,0] })
    },
  
    /**
     * @param  {TweenElement} element
     * @param  {Array<number>} values
     * @param  {EasingType} easing
     * @return {TweenAnimation} 
     */ 
    MoveY: (element, values, easing) => {
      return new TweenAnimation(element, { CSSType:CSSType.TRANSLATE3D , values : values , easing : easing})
    },
  
    // TO-DO : Translate3D로 치환되는것들은 알아서 values를 3개로 바꿔주는게 필요함. 
  
    /**
     * @param  {TweenElement} element
     * @param  {Array<number>} values
     * @param  {EasingType} easing
     * @return {TweenAnimation} 
     */ 
    VideoPlay: (element, values) => {
      return new TweenAnimation(element, { CSSType:CSSType.DRAWIMAGE , values : values})
    },
  
    None: (element) => {
      return new TweenAnimation(element, { CSSType:"NONE" })
    },  
  
  }
  
  
  class TweenDivElement extends TweenElement {
  
    constructor(tag, attribute){
      super();
      this._setElement(document.querySelector(tag));
  
      if (attribute) {
        this._addAnimation(attribute);
      }
    }
    
    updateLayout(){
    }
  }
  
  
  /**
   * Canvas Element에서 Source를 받을때 패턴으로 넣을경우 사용할 속성을 지정해주는 타입입니다.
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
  
  class TweenCanvasElement extends TweenElement {
    /**
     * 
     * @param {string} tag 
     * @param {Source} source
     * @param {TweenAnimationAttribute} [attribute] 
     */
    constructor( tag, source, attribute ){
  
      super();
      this._setElement(document.querySelector(tag));
  
      if (attribute) {
        this._addAnimation(attribute);
      }
    
      this.context = this._element.getContext('2d');
  
      /** @type {"automatic"|"height"|"width"} */
      this.fitType = "";
        
      /** @type {Source} */
      this.source = source;
      this.images = [];
        
      if (!Array.isArray(this.source.path)) {
          /// path를 패턴으로 입력한경우.
          const sourcePart1 = this.source.path.split("${")[0];
          const sourcePart2 = this.source.path.split("}")[1];
          const start = this.source.sourceAttribute.start;
          const end = this.source.sourceAttribute.end;
          const step = (this.source.sourceAttribute.step)? this.source.sourceAttribute.step : 1;
          const zeroPadding = (this.source.sourceAttribute.zeroPadding)? this.source.sourceAttribute.zeroPadding : "";
  
          for (let i = 0 ; i < end - start + 1 ; i = i + step) {
              let imgElem = new Image();
              let value;
              if (zeroPadding) {
                  value = (zeroPadding + (i + start)).substr(-zeroPadding.length, zeroPadding.length)
              } else {
                  value = i + start
              }
              imgElem.src = `${sourcePart1.concat(`${value}`).concat(sourcePart2)}`;
              this.images.push(imgElem);
          }
      } else {
          // 패턴이 아니라 직접 입력할경우.
          let imgElem = new Image();
          for (let i = 0 ; i < this.source.path.length ; i++) {
              imgElem.src = this.source.path[i];
          }
          this.images.push(imgElem)
      }
  
    }
  
  
    /** 
     * 브라우저 레이아웃 업데이트 시 불리는 함수입니다.
     */
    updateLayout(){
  
  
        const widthRatio = window.innerWidth / this._element.width;
        const heightRatio = window.innerHeight / this._element.height;
        let scaleRatio;
  
        switch(this.fitType) {
            default:
            case "automatic":
                if (widthRatio <= heightRatio) {
                    scaleRatio = heightRatio;
                } else {
                    scaleRatio = widthRatio;
                }
                break;
            case  "height":
                scaleRatio = heightRatio;
                break;
            case "width":
                scaleRatio = widthRatio
                break;
        }
  
        this.center(scaleRatio);
        super.updateLayout();
  
        // const HowManyPixelsInHieghtInOriginalScale = document.body.offsetWidth / canvasScaleRatio;
        // const HowManyPixelsInWidthInOriginalScale =  window.innerHeight / canvasScaleRatio;
  
    }
  
    /**
     * 첫번째 이미지 프레임을 미리 그려놓습니다.
     */
    
    setAutomaticFit(){
        this.fitType = "automatic"
    }
  
    setHighetFit(){
        this.fitType = "height"
    }
  
    setWidthFit(){
        this.fitType = "width"
    }
  
    /**
     * 
     * @param {*} scaleRatio 
     */
    center(scaleRatio){
        this._element.style.transform = `translate3d(-50%,-50%,0) scale(${scaleRatio})`;
    }
  
    setThumbnail(){
        this.context.drawImage(this.images[0], 0, 0);
    }
  }
  
  class TweenCanvasVideoElement extends TweenCanvasElement {
  
    /**
     * @param {string} tag 
     * @param {Source} source 
     * @param {TweenAnimationAttribute} attribute 
     */ 
  
    constructor(tag, source, attribute) {
      super(tag, source, attribute);
      this._addAnimation(
        {
          CSSType: CSSType.DRAWIMAGE,
          values: [0, this.images.length-1]
        }
      )
    }
  
  }
  
  
  class TweenCanvasImageElement extends TweenCanvasElement {
  
    /**
     * @param {string} tag 
     * @param {Source} source 
     * @param {TweenAnimationAttribute} attribute 
     */ 
    constructor(tag, source, attribute){
        super(tag, source, attribute);
    }
  }
  
  
  
  /**
   * 타이밍에 대한 타입입니다. Attribute에 추가될것입니다.
   * @typedef {{start:number, end:number}} Timing
   * */
  
  // 1. 타임라인그려줄것!
  // 2. 관련 애니메이션 다 정렬해서 모을것!
  // 3. 정렬할것. 
  
  class SceneBuilder {
  
    constructor(tag, ...tweenElements) {
      this.tag = tag;
      this.tweenElements = tweenElements;
  
      this.tweenElements.forEach( (value, index) => {
        if (value instanceof TweenAnimation)
          throw new Error(`${index}th TweenElement is not ready. please call ready()`)
      })
  
      this.elementIndex = 0;
      this.animationIndex = 0;
      this.processed = 0;
      this.length = undefined;
    }
  
    setTiming(timing = { start: 0, end: 0 }) {
  
      if (this.elementIndex >= this.tweenElements.length) {
        throw new Error("All tween elements are already set")
      }
      if (this.animationIndex >= this.tweenElements[this.elementIndex].getAnimations().length) {
        throw new Error("All animation timing are already set")
      }
  
      Object.assign(this.tweenElements[this.elementIndex].getAnimations()[this.animationIndex], { timing: timing });
      this.animationIndex++;
  
      if (this.animationIndex === this.tweenElements[this.elementIndex].getAnimations().length){
        this.animationIndex = 0;
        this.elementIndex++;
      }
      this.processed++;
  
      return this;
    }
  
    setTimingOnLayoutChanged(callbackFn, defaultTiming = { start: 0, end: 0 } ){
  
      if (this.elementIndex >= this.tweenElements.length) {
        throw new Error("All tween elements are already set")
      }
  
      if (this.animationIndex >= this.tweenElements[this.elementIndex].getAnimations().length) {
        throw new Error("All animation timing are already set")
      }
  
      Object.assign(this.tweenElements[this.elementIndex].getAnimations()[this.animationIndex], { timing : defaultTiming, timingOnLayoutChanged: callbackFn });
      this.animationIndex++;
  
      if (this.animationIndex === this.tweenElements[this.elementIndex].getAnimations().length){
        this.animationIndex = 0;
        this.elementIndex++;
      }
      this.processed++;
      return this;
    }
  
    setLength(value){
      this.length = value
      return this;
    }
  
    setFitLength(){
      this.length = document.querySelector(this.tag).offsetHeight;
      return this;
    }
    
    setLengthOnLayoutChanged(callbackFn) {
      this.length = callbackFn;
      return this;
    }
  
  
    build(){
  
      if (!this.length) {
        throw new Error("length is not set")
      }
  
      let totalAnimations = 0;
      this.tweenElements.forEach( (value) => { 
        
        totalAnimations += value.getAnimations().length 
      
      })
  
  
      if (this.processed !== totalAnimations) {
        throw new Error(`Some Animations is not set. Expected:${totalAnimations} Actual :${this.processed} `)
      } // TO-DO : where?
  
      // let total = [];
      // this.tweenElements.forEach((element) => {
      //   element.getAnimations().forEach( (animation) => {
      //     total.push(animation);
      //   })
      // })
        // console.log(total.sort((a,b) => { return a.timing.end < b.timing.end ? -1 : a.timing.end < b.timing.end ? 1: 0}))
      return new Scene(this.tag, this.tweenElements, this.length)
      
    }
  
  }
  
  
  class Scene {
  
    constructor(tag, tweens, length){
  
      this.tag = document.querySelector(tag);
      this.tweens = tweens;
      this.index = 0;
  
      if (typeof length !== 'number') {
        this.length = 0;
        this.lengthUpdater = length;
      } else {
        this.length = length;
      }
  
      this.sortedTweens = [];
    }
  
    updateLayout(){
      if (this.lengthUpdater) {
        this.length = this.lengthUpdater();
      }
  
      this.tweens.forEach( (tween) => {
        tween.updateLayout();
  
        let prevTween = undefined;
        tween.getAnimations().forEach( (animation) => {
          if (animation.timingOnLayoutChanged) {
            animation = animation.timingOnLayoutChanged( prevTween , Object.assign({}, animation) )
          }
          prevTween = animation
        })
      })
      
      /** 정렬과 분배 */
      this.tweens.forEach( (tween) => {
        let animations = tween.getAnimations();
        let sortedAnimationsByFinishTime = animations.sort((a,b) => { return a.timing.end < b.timing.end ? -1 : a.timing.end < b.timing.end ? 1: 0})
        let reducedAnimationsByStyle = sortedAnimationsByFinishTime.reduce( (prev, current, index, array) => {
          if (prev[current.CSSType]){
            const length = prev[current.CSSType].length;
            const prevElement = prev[current.CSSType][length-1]
            const lastend = prevElement.timing.end;
            const newstart = current.timing.start;
            prevElement.timing.breakpoint = (newstart - lastend) / 2 + lastend;
            if (array.length -1 === index) {
              current.timing.breakpoint = 1;
            }
            prev[current.CSSType].push(current)
          } else {
            prev[current.CSSType] = [current]
          }
          return prev;
        }, {})
        this.sortedTweens.push(
          Object.assign({},
            {
            _animations: reducedAnimationsByStyle,
            _element : tween._getElement()
            }, 
          )
        )
      })
    }
  
    getLength(){
      return this.length;
    }
  
  
    playAnimation(playhead) { 
  
      for( let i = 0 ; i < this.sortedTweens.length; i++) {
        const keys = Object.keys(this.sortedTweens[i]._animations);
        for (const key of keys) {
          const value = this.animationValueRatioReducerWith(this.sortedTweens[i]._animations[key], playhead);
          switch(key) {
            case CSSType.OPACITY:
              this.sortedTweens[i]._element.style.opacity = value;
            break;
            case CSSType.FILLRECT:
            break;
            case CSSType.TRANSLATE3D:
              this.sortedTweens[i]._element.style.transform = `translate3d(0,${value}%,0)`;
            break;
            case CSSType.DRAWIMAGE:
            break;
          }
        }
      }
    }
  
    /**
     * 순수하게 계산만 해준다. playHead의 값에 따라서 계산만해준다.
     * - 배열 1개당 값 1개만 나옴. 
     * @param {} array 
     * @param {*} callbackFn 
     * @param {*} currentValue 
     */
  
     //to-do: 순수하게 값 계산 말고, tween 엘리먼트를 받아서 애니메이션 onStart불러주게 변경.
    animationValueRatioReducerWith(array, currentValue) {
      
      for (let i = 0 ; i < array.length; i++) {
  
          if (array[i].timing.breakpoint && currentValue > array[i].timing.breakpoint) {
            // 이미 이것의 차례는 지나갔다. (array가 sort되어있기때문에 알수있음)
            continue;
          }
  
          const partScrollStart = array[i].timing.start;
          const partScrollEnd = array[i].timing.end;
          const partScrollHeight = partScrollEnd - partScrollStart;
  
          const time = (currentValue - partScrollStart) / partScrollHeight;
  
  
          const change = array[i].values[1] - array[i].values[0];
          const begin = array[i].values[0];
          const type = array[i].easing;
  
  
          let ret;
          if (currentValue >= partScrollStart && currentValue <= partScrollEnd) {
            ret = CALCENGINE(time, begin, change, type);
          } else if (currentValue < partScrollStart) {
            ret = array[i].values[0];
          } else if (currentValue > partScrollEnd) {
            ret = array[i].values[1];
          }
  
          return ret;
      }
  
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
  
      this._afterloadlayout = new Event("afterloadlayout", {bubbles: true});
      this._beforeloadlayout = new Event("beforeloadlayout", {bubbles: true}); 
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
          throw new Error(`${index}th scene is not built.`)
        }
        total += scene.getLength();
      });
  
      window.addEventListener("scroll", () => {
        this.yOffset = window.pageYOffset;
  
        if (this.pin && window.pageYOffset >= 0) {
          this.pin.style.transform = `translate3d(${
            (window.pageYOffset / total) * 100
          }%, 0,0)`;
        }
  
        this.updatePlayhead();
      });
  
      window.addEventListener("resize", () => {
        this.setLayout();
      });
  
      window.addEventListener("load", () => {
        if (this.pin && window.pageYOffset >= 0) {
          this.pin.style.transform = `translate3d(${
            (window.pageYOffset / total) * 100
          }%, 0,0)`;
        }
  
        document.body.dispatchEvent(this._beforeloadlayout);
        this.setLayout();
        document.body.dispatchEvent(this._afterloadlayout);
  
        //썸네일?? 어떻게처리할것?
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
        console.log("some section is not set");
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
        document.body.setAttribute("id", `show-scene-${this.currentScene}`);
      }
  
      if (this.yOffset < this.prevSceneLengths) {
        // 첫번째 씬의경우 줄어들일이 없다.
        if (this.currentScene === 0) return;
  
        this.currentScene--;
        enterNewScene = true;
        document.body.setAttribute("id", `show-scene-${this.currentScene}`);
      }
  
      // if (this.currentScene === 0) {
      //     //0이라면
      //     const loaded = this.scenes[this.currentScene]._onSceneLoaded;
      //     if (loaded) {
      //         loaded();
      //     }
      // }
  
      if (enterNewScene) {
        // 새로운 Scene에 들어갔을대
        return;
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
      //recalculate..?
  
      // 현재 currentScene이 어딘지 파악합니다.
      let totalScreenHeight = 0;
      for (let i = 0; i < this.scenes.length; i++) {
        totalScreenHeight += this.scenes[i].getLength();
        if (totalScreenHeight >= window.pageYOffset) {
          this.currentScene = i;
          break;
        }
      }
  
      document.body.setAttribute("id", `show-scene-${this.currentScene}`);
  
      // 그외에 필요한 설정은 외부에서 받도록합니다.
    }
  }
  
  
  // let abc;
  // abc = new TweenDivElement(".sticky-elem-canvas");
  // abc = TweenAnimationFactory.FadeIn(abc);
  // abc = TweenAnimationFactory.FadeIn(abc);
  // abc = TweenAnimationFactory.FadeIn(abc);
  // abc.onLayoutChanged((tag, attribute) => {
  //   return attribute;
  // })
  // abc = abc.ready();
  
  // let bcd;
  // bcd = new TweenDivElement(".sticky-elem-canvas");
  // bcd = TweenAnimationFactory.FadeIn(bcd);
  // bcd = TweenAnimationFactory.FadeIn(bcd);
  // bcd = TweenAnimationFactory.FadeIn(bcd);
  // bcd.onLayoutChanged((tag, attribute) => {
  //   return attribute;
  // })
  // bcd = bcd.ready();
  
  
  
  
  const project = new Project();
  
  document.body.addEventListener('beforeloadlayout', () => {
    })

document.body.addEventListener('afterloadlayout', () => {
})

  
  let messageGroup;
  messageGroup = new TweenDivElement("#scroll-section-0 .main-message-group");
  messageGroup = TweenAnimationFactory.MoveY(messageGroup, [10,0], EasingType.EASEIN)
  messageGroup = TweenAnimationFactory.MoveY(messageGroup, [0,-10], EasingType.EASEIN)
  messageGroup = TweenAnimationFactory.FadeOut(messageGroup)
  // messageGroup = messageGroup.ready();
  
  let messageA;
  messageA = new TweenDivElement("#scroll-section-0 .main-message.a")
  messageA = TweenAnimationFactory.FadeIn(messageA)
  messageA = TweenAnimationFactory.MoveY(messageA, [20,0])
  // messageA = messageA.ready();
  
  
  let messageB1;
  messageB1 = new TweenDivElement("#scroll-section-0 .main-message.b.b1")
  messageB1 = TweenAnimationFactory.FadeIn(messageB1)
  messageB1 = TweenAnimationFactory.MoveY(messageB1, [20,0])
  // messageB1 = messageB1.ready();
  
  let messageB2;
  messageB2 = new TweenDivElement("#scroll-section-0 .main-message.b.b2")
  messageB2 = TweenAnimationFactory.FadeIn(messageB2)
  messageB2 = TweenAnimationFactory.MoveY(messageB2, [20,0])
  // messageB2.ready();
  // messageB2 = messageB2.ready();
  //this element
  
  let messageC;
  messageC = new TweenDivElement("#scroll-section-0 .main-message.c")
  messageC = TweenAnimationFactory.FadeIn(messageC)
  messageC = TweenAnimationFactory.MoveY(messageC, [20,0])
  // messageC.ready();
  // messageC = messageC.ready();
  
  let messageD;
  messageD = new TweenDivElement("#scroll-section-0 .main-message.d")
  messageD = TweenAnimationFactory.FadeIn(messageD)
  messageD = TweenAnimationFactory.MoveY(messageD, [20,0])
  // messageD = messageD.ready();
  
  
  // @autoready
  const scene1 = new SceneBuilder(
    "#scroll-section-0", 
    messageGroup.ready(),
    messageA.ready(),
    messageB1.ready(),
    messageB2.ready(),
    messageC.ready(),
    messageD.ready(),
  )
  .setLengthOnLayoutChanged( () => {
    return window.innerHeight * 5;
  })
  .setTiming({start :0, end : 0.4})
  .setTiming({start: 0.5, end: 0.65})
  .setTiming({start : 0.55, end :0.65})
  .setTiming({start : 0.2, end :0.3})
  .setTiming({start : 0.2, end :0.3})
  .setTiming({start : 0.23, end :0.33})
  .setTiming({start : 0.23, end :0.33})
  .setTiming({start : 0.25, end :0.35})
  .setTiming({start : 0.25, end :0.35})
  .setTiming({start : 0.27, end :0.37})
  .setTiming({start : 0.27, end :0.37})
  .setTiming({start : 0.29, end :0.39})
  .setTiming({start : 0.29, end :0.39})
  .build();
  
  
  project.load(scene1);
  
  
  /**
   * 
   * iPhone 11 Pro called.
  It wants its chip back.
  
   */
  // to-do
    //.onAppear()
    //.onDisappear()
    //.onTime()
    //beforeLoad();
    //onAppear()
    //onDisappear() 
    //preload() 
    //.preload()
    //.snapshot()
    //.ready() 
    //.then() 
    //.and() 
    //done()
    //and()
    //bindTo()
    //then()
    //startwith
    //startafter