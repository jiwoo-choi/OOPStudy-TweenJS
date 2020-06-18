

/** 
 * TODO- 너무 복잡한경우는 오히려 코드가 복잡해지니
 * 단순하게 그리는 작업을 하기위해서는 PlayAnimation()코드를 가져가야합니다.
 * //Scene의 playAniomation에 내가원하는 코드를 넣어주는겁니다.
 * //currentScene, scrollRatioe도 받아야하는거죠
 * // 현재 Scene에 manually하게 추가할 수 있습니다.
 * 
 * 
 * scene.playAnmiationExtension( () => {
 *  attribute;
 *  //timing 정하고 다해서..
 *  playAnimaiton을 수행시키는겁니다.
 *  value;
 * 
 * } ) 
 * 
 */

// const a = document.querySelector(".cover-video")
// const heightRatio = window.innerHeight / a.height;
// a.style.transform = `translate3d(-50%,-50%,0) scale(${heightRatio})`;

const project = new Project();

// //캔버스를 그리는것처럼 너무 복잡한경우는 
let section3_canvas_1;
section3_canvas_1 = new TweenCanvasElement(".cover-canvas");
section3_canvas_1.setAutomaticFit();
section3_canvas_1.setFillStyle('white');

const height = section3_canvas_1.height;
const width = section3_canvas_1.width;

section3_canvas_1 = TweenCanvasAnimationFactory.DrawingRectX(section3_canvas_1, { values : [0,0], canvasDrawingDimension: { x: 0 , y : 0 , width: width, height : height}});
section3_canvas_1.setAttributeonLayoutChanged( (current) => {
    const ratio = current.scaleRatio;
    // 실제 canvas스케일에서 (1) , (0.5~) 스케일에서의 innerwidth는 어떻게표현되는가?
    const HowManyPixelsInWidthInOriginalScale = document.body.offsetWidth / ratio;
    const whiteWidth = HowManyPixelsInWidthInOriginalScale * 0.4;
    current.canvasDrawingDimension.width = whiteWidth;
    current.values[0] = (width - HowManyPixelsInWidthInOriginalScale) / 2
    current.values[1] = current.values[0] - whiteWidth;
    return current;
})

// section3_canvas_1 = TweenCanvasAnimationFactory.DrawingRectX(section3_canvas_1, { values : [0,0], canvasDrawingDimension: { x: 0 , y : 0 , width: width, height : height}});
// section3_canvas_1.setAttributeonLayoutChanged( (current) => {
//     const ratio = current.scaleRatio;
//     // 실제 canvas스케일에서 (1) , (0.5~) 스케일에서의 innerwidth는 어떻게표현되는가?
//     const HowManyPixelsInWidthInOriginalScale = document.body.offsetWidth / ratio;
//     const whiteWidth = HowManyPixelsInWidthInOriginalScale * 0.4;
//     current.canvasDrawingDimension.width = whiteWidth;
//     const x = (width - HowManyPixelsInWidthInOriginalScale) / 2
//     current.values[0] = x + HowManyPixelsInWidthInOriginalScale - whiteWidth;
//     current.values[1] = current.values[0] + whiteWidth;
//     return current;
// })

// section3_canvas_1 = TweenCanvasAnimationFactory.DrawingRectY(section3_canvas_1, { values : [0,0], canvasDrawingDimension: { x: 0 , y : 0 , width: width, height : height}});
// section3_canvas_1.setAttributeonLayoutChanged( (current) => {
//     const ratio = current.scaleRatio;
//     const HowManyPixelsInHeightInOriginalScale = window.innerHeight / ratio;
//     const whiteHeight = HowManyPixelsInHeightInOriginalScale * 0.4;
//     current.canvasDrawingDimension.height = whiteHeight;
//     current.values[0] = (height - HowManyPixelsInHeightInOriginalScale) / 2
//     current.values[1] = current.values[0] - whiteHeight;
//     return current;
// })


// section3_canvas_1.setAttributeonLayoutChanged( (current) => {
//     const ratio = current.scaleRatio;
//     // 실제 canvas스케일에서 (1) , (0.5~) 스케일에서의 innerwidth는 어떻게표현되는가?
//     const HowManyPixelsInWidthInOriginalScale = document.body.offsetWidth / ratio;
//     const whiteWidth = HowManyPixelsInWidthInOriginalScale * 0.4;
//     current.canvasDrawingDimension.width = whiteWidth;
//     current.values[0] = (width - HowManyPixelsInWidthInOriginalScale) / 2
//     current.values[1] = current.values[0] - whiteWidth;
//     return current;
// })

// section3_canvas_1 = TweenCanvasAnimationFactory.DrawingRectX(section3_canvas_1, { values : [0,0], canvasDrawingDimension: { x: 0 , y : 0 , width: width, height : height}});
// section3_canvas_1.setAttributeonLayoutChanged( (current) => {
//     const ratio = current.scaleRatio;
//     // 실제 canvas스케일에서 (1) , (0.5~) 스케일에서의 innerwidth는 어떻게표현되는가?
//     const HowManyPixelsInWidthInOriginalScale = document.body.offsetWidth / ratio;
//     const whiteWidth = HowManyPixelsInWidthInOriginalScale * 0.4;
//     current.canvasDrawingDimension.width = whiteWidth;
//     const x = (width - HowManyPixelsInWidthInOriginalScale) / 2
//     current.values[0] = x + HowManyPixelsInWidthInOriginalScale - whiteWidth;
//     current.values[1] = current.values[0] + whiteWidth;
//     return current;
// })

// section3_canvas_1 = TweenCanvasAnimationFactory.DrawingRectY(section3_canvas_1, { values : [0,0], canvasDrawingDimension: { x: 0 , y : 0 , width: width, height : height}});
// section3_canvas_1.setAttributeonLayoutChanged( (current) => {
//     const ratio = current.scaleRatio;
//     const HowManyPixelsInHeightInOriginalScale = window.innerHeight / ratio;
//     const whiteHeight = HowManyPixelsInHeightInOriginalScale * 0.4;
//     current.canvasDrawingDimension.height = whiteHeight;
//     current.values[0] = (height - HowManyPixelsInHeightInOriginalScale) / 2
//     current.values[1] = current.values[0] - whiteHeight;
//     return current;
// })




// // section3_canvas_1 = TweenAnimationFactory.DrawingRectX(section3_canvas_1, [0,0], {x: 0, y:0, width: width, height: height});
// // section3_canvas_1.setAttributeonLayoutChanged( (current) => {

// //     const ratio = current.scaleRatio;
// //     const HowManyPixelsInWidthInOriginalScale = document.body.offsetWidth / ratio;
// //     const whiteWidth = parseInt(HowManyPixelsInWidthInOriginalScale * 0.15);
// //     current.canvasDrawingDimension.width = whiteWidth

// //     const x1 = (width - HowManyPixelsInWidthInOriginalScale) / 2;
// //     current.values[0] = x1 + HowManyPixelsInWidthInOriginalScale - whiteWidth;
// //     current.values[1] = current.values[0] + whiteWidth;
// //     return current;
// // })

const scene3 = new SceneBuilder("#section-call-back",
    section3_canvas_1.ready()
)
.setLengthOnLayoutChanged( () => {
    return window.innerHeight * 10;
})
.setTiming({start:0, end: 0.5})
.extendPlayAnimation( { 
    canvasElement: {
        element : document.querySelector("section3_canvas_1"),
        values : [0,1],
        timing : {start :0, end: 0.5}
    }
}, (playhead, attribute, calculator)=> {
    console.log(playhead);
    console.log(attribute);
})
.build();


//step이라던지 이런거는 layoutchnaged될때마다 실행하는거니까....

//한번만실행하도록해야함.

// .setTimingOnLayoutChanged( () => {
//     return {start : 0, end : (1/8)/2}
// })
// .setTimingOnLayoutChanged( () => {
//     return {start : (1/8)/2, end : (1/8)}
// })
// .setTimingOnLayoutChanged( (prev, current, animation) => {

//     // To-Do : prev -> timing? 
//     const whenThisElementReachToTop = current._element.offsetTop + (current._element.height - current._element.height * current.scaleRatio) / 2; 
//     // TO-DO : length 설정하는방법이 매우 안전하지않습니다.
//     const length = window.innerHeight * 8;
//     return {start: (window.innerHeight/2) / length, end: whenThisElementReachToTop/length}
// })
// .setTimingOnLayoutChanged( (prevTiming, current, animation) => {
//     return {start: prevTiming.end, end: prevTiming.end+0.1}
// })


project.load(scene3);

