/**
 * 등장하고 하는방법도있음.
 * 등장했을때 타이밍이 애매한것. (이친구가등장할때가 있음)
 * 
 * 
 * sticky로 해도됨. 새롭게 그리는거? image로 그리는거? 새롭게그리는건 캔버스가좋겠다.
 */

const project = new Project();

let section1_black_layer;
section1_black_layer = new TweenDivElement("#section-introduction .black-layer");
section1_black_layer = TweenAnimationFactory.FadeIn(section1_black_layer, [0, 0.5]); 

let section1_message_group;
section1_message_group = new TweenDivElement("#section-introduction #sticky-group");
section1_message_group = TweenAnimationFactory.MoveY(section1_message_group, [20,0]);
section1_message_group = TweenAnimationFactory.MoveY(section1_message_group, [0,-10]);
section1_message_group = TweenAnimationFactory.FadeOut(section1_message_group);

let section1_logo;
section1_logo = new TweenDivElement("#section-introduction .message-logo");
section1_logo = TweenAnimationFactory.FadeIn(section1_logo);
section1_logo = TweenAnimationFactory.MoveY(section1_logo, [20,0]);

let section1_message_1;
section1_message_1 = new TweenDivElement("#section-introduction #message-1");
section1_message_1 = TweenAnimationFactory.MoveY(section1_message_1, [20,0]);
section1_message_1 = TweenAnimationFactory.FadeIn(section1_message_1);

let section1_message_2;
section1_message_2 = new TweenDivElement("#section-introduction #message-2");
section1_message_2 = TweenAnimationFactory.MoveY(section1_message_2, [20,0]);
section1_message_2 = TweenAnimationFactory.FadeIn(section1_message_2,);

let section1_message_3;
section1_message_3 = new TweenDivElement("#section-introduction #message-3");
section1_message_3 = TweenAnimationFactory.MoveY(section1_message_3, [20,0]);
section1_message_3 = TweenAnimationFactory.FadeIn(section1_message_3);

let section1_price;
section1_price = new TweenDivElement("#section-introduction #price");
section1_price = TweenAnimationFactory.MoveY(section1_price, [20,0]);
section1_price = TweenAnimationFactory.FadeIn(section1_price);

const scene1 = new SceneBuilder("#section-introduction",
section1_black_layer.ready(),
section1_message_group.ready(),
section1_logo.ready(),
section1_message_1.ready(),
section1_message_2.ready(),
section1_message_3.ready(),
section1_price.ready()
)
.setLengthOnLayoutChanged( () => {
    return window.innerHeight * 4;
})
.setTiming({start: 0.2 , end: 0.6})
.setTiming({start : 0 , end : 0.6})
.setTiming({start : 0.8 , end : 0.9})
.setTiming({start : 0.85 , end : 0.9})
.setTiming({start : 0.27 , end : 0.38})
.setTiming({start : 0.27 , end : 0.38})
.setTiming({start : 0.3 , end : 0.4})
.setTiming({start : 0.3 , end : 0.4})
.setTiming({start : 0.34 , end : 0.44})
.setTiming({start : 0.34 , end : 0.44})
.setTiming({start : 0.37 , end : 0.47})
.setTiming({start : 0.37 , end : 0.47})
.setTiming({start : 0.41 , end : 0.51})
.setTiming({start : 0.41 , end : 0.51})
.build();

//offset?
const scene2 = new SceneBuilder("#section-introduction-1")
.setLengthOnLayoutChanged( () => {
    return window.innerHeight * 1.5;
})
.build();

/**
 * 100vh대로 뚫어놓고
 * 0부터 100vh까지 만들기.. 이게 하나의 방법이겠죠?
 * sticky없이 0부터 100vh까지 
 * 100vh이후에 자료가 나오도록하면됨.
 * translate3d 는 parse int로..
 */
let section3_message_1;
section3_message_1 = new TweenDivElement("#section-call-back #message-1");
section3_message_1 = TweenAnimationFactory.FadeIn(section3_message_1);
section3_message_1 = TweenAnimationFactory.FadeOut(section3_message_1);

let section3_canvas_1;
section3_canvas_1 = new TweenCanvasElement(".cover-canvas");
section3_canvas_1.setAutomaticFit();
section3_canvas_1 = TweenAnimationFactory.DrawingRectX(section3_canvas_1);
section3_canvas_1.setAttributeonLayoutChanged( (current) => {

    const recalculatedInnerWidth = document.body.offsetWidth / current.scaleRatio;
    const whiteRectWidth = recalculatedInnerWidth * 0.15;
    current.values[0] = (current.initialValue.width - recalculatedInnerWidth) / 2;
    current.values[1] = current.values[0] - whiteRectWidth
    return current;
})
section3_canvas_1 = TweenAnimationFactory.DrawingRectX(section3_canvas_1);
section3_canvas_1.setAttributeonLayoutChanged( (current) => {

    const recalculatedInnerWidth = document.body.offsetWidth / current.scaleRatio;
    const whiteRectWidth = recalculatedInnerWidth * 0.15;
    const value1 = (current.initialValue.width - recalculatedInnerWidth) / 2;
    current.values[0] = value1 + recalculatedInnerWidth - whiteRectWidth;
    current.values[1] = current.value[0] + whiteRectWidth;

    return current;
})



const scene3 = new SceneBuilder("#section-call-back",
    section3_message_1.ready(),
    section3_canvas_1.ready()
)
.setLengthOnLayoutChanged( () => {
    return window.innerHeight * 8;
})
.setTimingOnLayoutChanged( () => {
    return {start : 0, end : (1/8)/2}
})
.setTimingOnLayoutChanged( () => {
    return {start : (1/8)/2, end : (1/8)}
})
.setTimingOnLayoutChanged( (prevTiming, currentTween, currentAnimation) => {

    // To-Do : prev -> timing? 
    const whenThisElementReachToTop = current._element.offsetTop + (current._element.height - current._element.height * current.scaleRatio) / 2; 
    // TO-DO : length 설정하는방법이 매우 안전하지않습니다.
    const length = window.innerHeight * 8;
    console.log(current.scaleRatio)
    return {start: (window.innerHeight/2) / length, end: whenThisElementReachToTop/length}
})
.setTimingOnLayoutChanged( (prevTiming, current, animation) => {
    return {start: prevTiming.end, end: prevTiming.end+0.1}
})
.build();



project.load(scene1,scene2,scene3);



// const project = new Project();

// document.body.addEventListener('beforeloadlayout', () => {
// })

// document.body.addEventListener('afterloadlayout', () => {
// })


// let messageGroup;
// messageGroup = new TweenDivElement("#scroll-section-0 .main-message-group");
// messageGroup = TweenAnimationFactory.MoveY(messageGroup, [10,0], EasingType.EASEIN)
// messageGroup = TweenAnimationFactory.MoveY(messageGroup, [0,-10], EasingType.EASEIN)
// messageGroup = TweenAnimationFactory.FadeOut(messageGroup)
// // messageGroup = messageGroup.ready();

// let messageA;
// messageA = new TweenDivElement("#scroll-section-0 .main-message.a")
// messageA = TweenAnimationFactory.FadeIn(messageA)
// messageA = TweenAnimationFactory.MoveY(messageA, [20,0])
// // messageA = messageA.ready();


// let messageB1;
// messageB1 = new TweenDivElement("#scroll-section-0 .main-message.b.b1")
// messageB1 = TweenAnimationFactory.FadeIn(messageB1)
// messageB1 = TweenAnimationFactory.MoveY(messageB1, [20,0])
// // messageB1 = messageB1.ready();

// let messageB2;
// messageB2 = new TweenDivElement("#scroll-section-0 .main-message.b.b2")
// messageB2 = TweenAnimationFactory.FadeIn(messageB2)
// messageB2 = TweenAnimationFactory.MoveY(messageB2, [20,0])
// // messageB2.ready();
// // messageB2 = messageB2.ready();
// //this element

// let messageC;
// messageC = new TweenDivElement("#scroll-section-0 .main-message.c")
// messageC = TweenAnimationFactory.FadeIn(messageC)
// messageC = TweenAnimationFactory.MoveY(messageC, [20,0])
// // messageC.ready();
// // messageC = messageC.ready();

// let messageD;
// messageD = new TweenDivElement("#scroll-section-0 .main-message.d")
// messageD = TweenAnimationFactory.FadeIn(messageD)
// messageD = TweenAnimationFactory.MoveY(messageD, [20,0])
// // messageD = messageD.ready();


// const scene1 = new SceneBuilder(
// "scroll-section-0", 
// messageGroup.ready(),
// messageA.ready(),
// messageB1.ready(),
// messageB2.ready(),
// messageC.ready(),
// messageD.ready(),
// )
// .setLengthOnLayoutChanged( () => {
// return window.innerHeight * 5;
// })
// .setTiming({start :0, end : 0.4})
// .setTiming({start: 0.5, end: 0.65})
// .setTiming({start : 0.55, end :0.65})
// .setTiming({start : 0.2, end :0.3})
// .setTiming({start : 0.2, end :0.3})
// .setTiming({start : 0.23, end :0.33})
// .setTiming({start : 0.23, end :0.33})
// .setTiming({start : 0.25, end :0.35})
// .setTiming({start : 0.25, end :0.35})
// .setTiming({start : 0.27, end :0.37})
// .setTiming({start : 0.27, end :0.37})
// .setTiming({start : 0.29, end :0.39})
// .setTiming({start : 0.29, end :0.39})
// .build();


// project.load(scene1);


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