# TweenJS

Simple Interaction Generator for Interactive Web
Inspired by codes from [link](https://www.inflearn.com/course/%EC%95%A0%ED%94%8C-%EC%9B%B9%EC%82%AC%EC%9D%B4%ED%8A%B8-%EC%9D%B8%ED%84%B0%EB%9E%99%EC%85%98-%ED%81%B4%EB%A1%A0)

인프런 인터렉티브 웹사이트 만들기 중, JS부분의 로직을 정리하여 라이브러리화 하였습니다.

## Class Structure

### Project 
한 페이지의 `Scene` 들을 관리하는 클래스입니다.
`Project class` 의 역할은 `Scene`들을 로드하여 관리하거나, 브라우저의 변화에 대응합니다.

### Scene
`Scene`은 `Tween` 엘리먼트들의 모음입니다. 
`Scene`의 역할은 `Tween`  객체들의 배치, `timing` 설정, `Scene`의 길이 설정 등. 한 `Scene`에 대한 전반적인 설정을 수행합니다.

### TweenElement
`TweenElement`는 뷰 엘리먼트와 애니메이션을 연결시켜주는 클래스입니다. HTML용 엘리먼트로는 `TweenDivElement`, `TweenCanvasElement`등이 있습니다.

### TweenAnimation
`TweenAnimation`은 `TweenElement`의 애니메이션 속성입니다. 애니메이션의 속성과 콜백함수등을 정하여 `TweenElement`에 추가합니다. `TweenAnimation` 단독으로는 애니메이션을 표기할 수 없습니다. 반드시 `TweenElement`에 추가하여야합니다.

## Usage 

### 1.  Create Project 
```
const project = new Project(true);
```
프로젝트를 생성합니다. 

**Constructor Parameters**
|  name | type  |  description |
|:-:|:-:|:-:|
|  dev |  boolean? | dev모드 설정여부.  |

`dev모드`를 true로 설정할경우, 브라우저 하단에 각 씬들의 타임라인을 볼 수 있는 영역이 생깁니다.
![enter image description here](https://github.com/jiwoo-choi/TweenJS/blob/master/project.png?raw=true)


### 2. Create Scene & Create Tween
```
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

let messageA;
messageA = new TweenDivElement("#scroll-section-0 .main-message.a")
messageA = TweenAnimationFactory.FadeIn(messageA)
messageA = TweenAnimationFactory.MoveY(messageA, [20,0])


let messageB1;
messageB1 = new TweenDivElement("#scroll-section-0 .main-message.b.b1")
messageB1 = TweenAnimationFactory.FadeIn(messageB1)
messageB1 = TweenAnimationFactory.MoveY(messageB1, [20,0])

let messageB2;
messageB2 = new TweenDivElement("#scroll-section-0 .main-message.b.b2")
messageB2 = TweenAnimationFactory.FadeIn(messageB2)
messageB2 = TweenAnimationFactory.MoveY(messageB2, [20,0])

let messageC;
messageC = new TweenDivElement("#scroll-section-0 .main-message.c")
messageC = TweenAnimationFactory.FadeIn(messageC)
messageC = TweenAnimationFactory.MoveY(messageC, [20,0])

let messageD;
messageD = new TweenDivElement("#scroll-section-0 .main-message.d")
messageD = TweenAnimationFactory.FadeIn(messageD)
messageD = TweenAnimationFactory.MoveY(messageD, [20,0])


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
  
```
