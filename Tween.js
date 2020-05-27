
/**
 * 트윈 엘리먼트 타입의 종류입니다.
 * @typedef {('text'|'canvas'|null)} TweenElementType
 * @typedef {('opacity'|'translateY')} TweenAnimationType
 * @typedef {Array.<number>} AnimationValue
 * @typedef {{start:number, end:number}} keyFrameValue
 */


 // TODO : EASY IN _ EASY OUT
 /**
 * `Scene` 들을 관리하는 클래스입니다. 전체 애니메이션이 발생하는 한 페이지 단위이기도 합니다.
 * - `Scene`들을 `load()`하고, 스크롤이나, 사이즈가 변경될때마다 레이아웃도 변경해줍니다.
 * - `constructor(true)`를 실행하면 `dev`모드가 실행됩니다.
 */

class Project {

    /**
     * @param {boolean} [dev=false] - dev모드 실행 여부입니다.
     */
    constructor(dev=false) {

        /** @type {...Scene[]} - `Scene`들을 담는 변수입니다 */
        this.scenes = [];
        this.setLayout = this.setLayout.bind(this);
        this.updatePlayHead = this.updatePlayhead.bind(this);
        this.setLayout = this.setLayout.bind(this);
        
        /** @type {number} - 현재 활성화 되어있는 씬입니다. */
        this.currentScene = 0;
        /** @type {number} - 현재 스크롤한 yOffset값입니다. */
        this.yOffset = window.pageYOffset;
        this.dev = dev;
    }

    /** 
     * 프로젝트에서 사용할 씬들을 모두 로드하고, `window`의 `addEventListener`를 구독하기 시작합니다.
     * - 정상적으로 로드를 하기위해서는 각 `Scene`들이 모두 `ready()`가 불려져야합니다. 
     * @param {...Scene[]} args 프로젝트에서 활용할 `Scene` 객체들.
     * @throws 로드를 요청한 씬들이 `ready()` 상태가 아니라면 에러 발생.
     */
    load(...args){

        this.scenes = args;
        let total = 0;
        this.scenes.forEach( (scene, index) => {
            if (!scene.isReady) {
                let message = `Load Failure : scene#${index} is not ready.`
                throw new Error(message);
            }
            total += scene.getLength();
        })

        window.addEventListener('scroll', () => {
            this.yOffset = window.pageYOffset;

            if (this.pin && (window.pageYOffset >= 0)) {
                this.pin.style.transform = `translate3d(${window.pageYOffset/total*100}%, 0,0)`
            }

            this.updatePlayhead();
        })
    
        window.addEventListener('resize', this.setLayout);
        window.addEventListener('load', ()=>{
            if (this.pin && (window.pageYOffset >= 0)) {
                this.pin.style.transform = `translate3d(${window.pageYOffset/total*100}%, 0,0)`
            }
            this.setLayout();
        })

              

        if (this.dev) {

            const sceneContainerLength = this.scenes.length * 30 + 30;

            const dummy = window.document.createElement('div');
            dummy.style.width = '100%';
            dummy.style.height = `${sceneContainerLength}px`;
            document.body.appendChild(dummy);
    
            const container = window.document.createElement('div');
            container.style.position = 'fixed';
            container.style.bottom = '0';
            container.style.width = '100%';
            document.body.appendChild(container);
    
            const header = window.document.createElement('div');
            const text = document.createTextNode("Project Timeline");
            header.style.background = 'rgb(29, 29, 31)';
            header.style.borderBottom = '1px solid black';
            header.style.width = '100%';
            header.style.height = '30px';
            header.style.color = 'white';
            header.style.display = 'flex';
            header.style.alignItems = 'center';
            header.style.borderRadius = '9px 9px 0 0';
            header.style.paddingLeft = '10px'
            container.appendChild(header);
            header.appendChild(text);
    
            const pinContainer = window.document.createElement('div');
            pinContainer.style.position = 'absolute';
            pinContainer.style.zIndex = '9';
            pinContainer.style.height = `${sceneContainerLength-30}px`;
            pinContainer.style.width = '100%';
            pinContainer.style.height = '100%';
            container.appendChild(pinContainer);
            this.pin = pinContainer;
    
            const pin = window.document.createElement('div');
            pin.style.position = 'relative';
            pin.style.zIndex = '10';
            pin.style.height = `${sceneContainerLength-30}px`;
            pin.style.width = '2px';
            pin.style.background = 'red';
            pin.style.top = '0';
            pinContainer.appendChild(pin);
    
            function getRandomColor() {
                var letters = '0123456789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6; i++) {
                  color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
              }
              
    
            let previous = 0;
            this.scenes.forEach((value, index) => {
    
                const sceneContainer = window.document.createElement('div');
                sceneContainer.style.background = 'rgb(29, 29, 31)';
                sceneContainer.style.borderBottom = '1px solid black';
                sceneContainer.style.width = '100%';
                container.appendChild(sceneContainer);
    
                const scene = window.document.createElement('div');
                scene.style.position = 'relative';
                scene.style.background = getRandomColor();
                scene.style.width = `${value.getLength()/total * 100}%`;
                scene.style.height = '30px';
                scene.style.left = `${previous}%`;
                previous += value.getLength()/total * 100;
                sceneContainer.appendChild(scene);
            })
        
        }


    }

    
    /**
     * 현재 스크롤에 따라 플레이 헤드를 업데이트해줍니다..
     * - 현재 활성화해야하는 Scene을 보여줍니다. //shouldupdate?
     * - 현재 활성화해야하는 Scene들도 보여줍니다.
     */
    updatePlayhead(){

        if (!this.scenes[this.currentScene]) {
            console.log('not enough');
            return;
        }

        let enterNewScene = false;
        this.prevSceneLengths = 0;

        for (let i = 0 ; i < this.currentScene; i++) {
            this.prevSceneLengths += this.scenes[i].getLength();
        } 

        if (this.yOffset > this.prevSceneLengths + this.scenes[this.currentScene].getLength()) {
            this.currentScene++;
            enterNewScene = true;
            document.body.setAttribute('id', `show-scene-${this.currentScene}`)
        }

        if (this.yOffset < this.prevSceneLengths) {
            if (this.currentScene === 0) return;
            this.currentScene--;
            enterNewScene = true;
            document.body.setAttribute('id', `show-scene-${this.currentScene}`)
        }

        if (enterNewScene) {
            return;
        } else {
            const currentYOffsetAtScene = this.yOffset - this.prevSceneLengths;
            const scrollRatio = currentYOffsetAtScene / this.scenes[this.currentScene].getLength();
            this.scenes[this.currentScene].playAnimation(scrollRatio);
        }
    }

    /**
     * 브라우저의 창에 대한 레이아웃 상태를 기반으로 scene을 정해주는 함수입니다..
     */
    setLayout(fnc){

        // 씬들의 길이를 할당합니다.
        for (let i = 0 ; i < this.scenes.length; i++) {
            this.scenes[i].container.style.height = `${this.scenes[i].recalculateLength().getLength()}px`;
        }

        // 현재 currentScene이 어딘지 파악합니다.
        let totalScreenHeight = 0;
        for (let i =0 ; i < this.scenes.length; i++) {
            totalScreenHeight += this.scenes[i].recalculateLength().getLength();
            if ( totalScreenHeight >= window.pageYOffset) {
                this.currentScene = i;
                break;
            }
        }

        document.body.setAttribute('id', `show-scene-${this.currentScene}`)

        // 그외에 필요한 설정은 외부에서 받도록합니다.
        if (fnc) {
            fnc();
        }

    }

}



/**
 * 
 * @typedef { Tween , {keyframe: keyFrameValue}} ScenedTweenElement
 * @property Tween
 */
class Scene {

    /**
     * 
     * @param {HTMLElement} container - 이 씬 컨테이너의 태그주소입니다.
     * @param {...Tween} tweens - 애니메이션 엘리먼트들입니다. array로 전달될경우, 하나의 그룹으로 판단합니다.
     */
    constructor(container,...tweens){
        this.container = document.querySelector(container)
        /** @type {ScenedTweenElement[]} - updated tweens */
        this.tweens = tweens;
        this.index = 0;
        this.isReady = false;
        this.length = 0;
        this.animationValueMapperWith = this.animationValueMapperWith.bind(this);
    }

    /**
     * 
     * 각 애니메이션의 키프레임을 정합니다. 
     * 1. **순서** 대로 들어가므로, Tween객체를 입력한 순서대로 정해야합니다.
     * ```
     * new Scene( new Tween('1번Tween'))
     * .setKeyframe(1) // 1번 Tween에 해당하는 keyFrame
     * ```
     * 2. Tween 객체 하나당 keyFrame 1개는 필수적으로 들어가야합니다. 
     * 3. 다만 키프레임 argument가 공란이라면, 디폴트로 0(시작)-1(끝)으로 설정됩니다. 
     * 4. value를 두개 넣었다면, 반드시 keyFrame도 두개로 들어가야합니다. array타입으로 넣어줍니다.
     * @param {Tween} tween 
     * @param {keyFrameValue|[keyFrameValue,keyFrameValue]} keyFrame 
     * @return {Scene} 
     */
    setKeyFrame(keyFrame) {

        this.isReady = false;

        if(this.index > this.tweens.length) {
            // 더이상 진행되지 않아도 됨.
            return this;
        }

        if (keyFrame) {
            // argument가 있는 경우.
            Object.assign(this.tweens[this.index], {keyframe: keyFrame});
            this.index++;
        } else {
            // argument가 없는 경우.
            Object.assign(this.tweens[this.index][i], {keyframe: {start : 0 , end : 0}});
            this.index++;
        }

        return this;

    }

    /**
     * 이 신의 총 길이를 담습니다.
     * @param {number} length 
     * @return {this}
     */
    setLength(length) {
        this.isReady = false;
        this.length = length;
        // this.container.style.height = `${this.length}px`;
        return this;
    }

    /**
     * 이 신의 총 길이를 담습니다. 근데 이제 배수를 곁들인..
     * @param {number} multiple
     * @return {this}
     */
    setMultipleLength(multiple) {
        this.isReady = false;
        this.length = window.innerHeight * multiple;
        // this.container.style.height = `${this.length}px`;
        return this;
    }

    /**
     * 가변일 경우에 재 계산해주는 메소드
     * set이지만 ready와 관계 없다. 
     */
    recalculateLength(){
        if (this.multiple)
            this.length = window.innerHeight * this.multiple;
        return this;
    }

    /**
     * 이 신의 총 길이를 담습니다. 근데 이제 컨테이너 사이즈랑 딱맞는..
     * @return {this}
     */
    setContainerLength(){
        this.isReady = false;
        this.length = this.container.offsetHeight;
        // this.container.style.height = `${this.length}px`;
        return this;
    }

    /**
     * 이 신의 총길이를 반환합니다.
     */
    getLength(){
        return this.length;
    }
    


    /**
     * 
     * Scene에서 setting 값을 제대로 했는지 체크해주는 validator 메소드입니다.
     * 체크항목
     * 1. Scene의 container tag가 valid한지.
     * 2. Scene의 
     * 통과하지않는다면 에러메세지를 출력하며, Project.load()에서도 에러가 걸립니다.
     */ 
    ready(){
    
        this.isReady = false;
    
        // 컨테이너가 valid한지 확인.
        if (this.container === undefined) {
            throw new Error(`${value.name}'s container is not valid`)
        }

        // length가 제대로 셋팅되었는지 확인.
        if (this.length === 0) {
            throw new Error(`length is not set`)
        }

        // 각 keyframe이 tween객체에 제대로 붙었는지 확인.
        this.tweens.forEach( (value) => {
            
            // keyframe이 셋팅되어있다.
            if (value.keyframe === undefined) {
                throw new Error(`${value.name}'s keyframe is not set.`)
            }

            // anmiation value가 그룹으로 들어왔는데, keyframe은 그룹화되어있지않다.
            // 현재는 개수확인은 안함. 똑같이 맵핑되어있는지만 확인.
            if (value.grouped) {
                if (!Array.isArray(value.keyframe)) {
                    throw new Error(`${value.name} : # of keyframe do not match to # of animation values.`)
                }
            } else {
                if (Array.isArray(value.keyframe)) {
                    throw new Error(`${value.name} : # of keyframe do not match to # of animation values.`)
                }

            }
        })

        this.isReady = true;
        return this;
    }





    /**
     * 현재 playhead의 값을 기반으로 animation value를 계산하는 함수.
     * @param {*} playhead 
     * @param {*} callbackFunc 
     */
    animationValueMapperWith(playhead, callbackFunc) {

        const tweens = this.tweens;

        for(let i = 0 ; i < tweens.length ; i++) {

            if (tweens[i].grouped) {

                const partScrollStart1 = tweens[i].keyframe[0].start 
                const partScrollEnd1 = tweens[i].keyframe[0].end
                const partScrollHeight1 = partScrollEnd1 - partScrollStart1;

                const partScrollStart2 = tweens[i].keyframe[1].start 
                const partScrollEnd2 = tweens[i].keyframe[1].end
                const partScrollHeight2 = partScrollEnd2 - partScrollStart2;
                const middlepoint = (partScrollStart2 - partScrollEnd1) / 2 + partScrollEnd1

                let ret;
                if (playhead <= middlepoint) {
                    if (playhead >= partScrollStart1 && playhead <= partScrollEnd1) {
                        ret = (playhead - partScrollStart1) / partScrollHeight1 * (tweens[i].values[0][1] - tweens[i].values[0][0]) + tweens[i].values[0][0];
                    } else if (playhead < partScrollStart1) {
                        ret = tweens[i].values[0][0];
                    } else if (playhead > partScrollEnd1) {
                        ret = tweens[i].values[0][1];
                    }
                }  else {
                    if (playhead >= partScrollStart2 && playhead <= partScrollEnd2) {
                        ret = (playhead - partScrollStart2) / partScrollHeight2 * (tweens[i].values[1][1] - tweens[i].values[1][0]) + tweens[i].values[1][0];
                    } else if (playhead < partScrollStart2) {
                        ret = tweens[i].values[1][0];
                    } else if (playhead > partScrollEnd2) {
                        ret = tweens[i].values[1][1];
                    }
                }

                callbackFunc(tweens[i], ret);

            } else {

                const partScrollStart = tweens[i].keyframe.start 
                const partScrollEnd = tweens[i].keyframe.end
                const partScrollHeight = partScrollEnd - partScrollStart;

                let ret;

                if (playhead >= partScrollStart && playhead <= partScrollEnd) {
                    ret = (playhead - partScrollStart) / partScrollHeight * (tweens[i].values[1] - tweens[i].values[0]) + tweens[i].values[0];
                } else if (playhead < partScrollStart) {
                    ret = tweens[i].values[0];
                } else if (playhead > partScrollEnd) {
                    ret = tweens[i].values[1];
                }

                callbackFunc(tweens[i], ret);

            }
        }
    }

    /**
     * 
     * 이 신에서의 애니메이션 실행부분을 담당하는 함수입니다.
     * 현재 scene의 모든 tween의 애니메이션을 가져오고, 그 tween element마다 현재 playhead타이밍에 맞는 애니메이션을 실행시킵니다.
     * @param {*} playhead - 현재 진척도를 알려줍니다. [0-1] 사이의 값입니다.
     */
    playAnimation(playhead){
        
        this.animationValueMapperWith(playhead, (tween, value) => {
            if (tween.animation === 'opacity') {
                tween.tag.style.opacity = value;
            } else {
                tween.tag.style.transform = `translate3d(0,${value}%,0)`
            }
        })
    }
}


/**
 * 각 태그와 애니메이션에 대한 정보를 가지고있는 클래스입니다.
 */
class Tween {
    /**
     * @param {string} name - 애니메이션을 대표할 네임입니다.
     * @param {TweenElementType} type - 애니메이션의 타입입니다. canvas애니메이션의 경우 canvas로, 일반 애니메이션의 경우 일반으로 설정합니다.
     * @param {HTMLElement} tag - 애니메이션이 적용될 태그정보입니다.
     * @param {TweenAnimationType} animation - 애니메이션의 종류입니다. 현재 지원되는 애니메이션은 opacity와 translateY가 있습니다.
     * @param {AnimationValue|[AnimationValue,AnimationValue]} values - 애니메이션에 해당하는 value입니다. in과 out 둘다 설정하기위해서는 **순서대로** Array타입으로 넣어주세요.
     * @param {boolean} grouped - in과 out이 병합된 케이스인지 확인하는 구분자입니다.
     */
    constructor(name="", type, tag, animation, values, grouped=false){
        this.name = name;
        this.type = type;
        this.tag = document.querySelector(tag);
        this.animation = animation;
        this.values = values;
        this.grouped = grouped;
    }
}







