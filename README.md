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
`Scene`의 역할은 `Tween`  객체들의 배치, `keyframe` 설정, `Scene`의 길이 설정 등. 한 `Scene`에 대한 전반적인 설정을 수행합니다.

### Tween
`Tween`은 가장 작은 **애니메이션 엘리먼트** 단위입니다.
개발자는 `Tween` 을 여러개 생성해,  하나의 `Scene`을 구성할 수 있습니다. `Tween`은 애니메이션에 대한 정보를 담습니다.


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
const scene1 = new Scene(
"#scroll-section-0",
new Tween("messageA_opacity", "text", '#scroll-section-0 .main-message.a', "opacity", [0,1]),
new Tween("messageA_translateY", "text", '#scroll-section-0 .main-message.a', "translateY", [-70, -100]),
new Tween("messageB_opacity", "text", '#scroll-section-0 .main-message.b', "opacity", [0,1]),
new Tween("messageB_translateY", "text", '#scroll-section-0 .main-message.b', "translateY", [0,-30]),
)
.setKeyFrame({start:  0.2, end:0.25})
.setKeyFrame({start:  0.2, end:0.25})
.setKeyFrame({start:  0.22, end:0.27})
.setKeyFrame({start:  0.22, end:0.27})
.setMultipleLength(5)
.ready()
```

**Constructor Parameters**
|  name | type  |  description |
|:-:|:-:|:-:|
|  container |  string! | `Scene` 컨테이너의 태그명입니다. 보통 `<section>`태그의 class/id입니다. |
|  ...tweens |  Tween[]! | `Scene`에 들어갈 `Tween` 엘리먼트 목록입니다. |

**Methods**
* **ready()** : `Scene` 셋팅에 문제가 없는지 체크하는 함수입니다. `ready()` 가 불려지지 않았으면 `Project`에 로드할 수 없습니다. 또한, `ready()`이후에 다시 설정을 재셋팅 하면 바꾸면 `ready() `상태가 해제됩니다.
* **setKeyFrame()** : `Tween`엘리먼트 순서대로 keyframe을 설정합니다. 순서대로 셋팅되며, `Tween` 엘리먼트를 그룹으로 생성했을경우 (예시, fade_in, fade_out의 두가지 애니메이션을 하나의 `Tween` 객체로 생성)  반드시 keyframe도 각 애니메이션의 개수에 맞춰 Array로 넣어줘야합니다. 
* **setMultipleLength** : `Scene`의 길이를 설정하는 방법중 한가징 입니다. 현재 브라우저의 높이의 배수로 `Scene`의 길이를 정하는 방법이며 가장 일반적인 방법입니다.

### 3. Load Scenes.
```
project.load(scene1, scene2, scene3, scene4);
```
생성한 `Scene`들을  로드합니다.
각  `Scene`은 항상 `ready()` 상태여야합니다.