const mapOptions = {
  center: new naver.maps.LatLng(37.3595704, 127.105399),
  zoom: 10,
};

const map = new naver.maps.Map("map", mapOptions);

const data = [
  {
    title: "용산역",
    address: "용산",
    lat: 37.529976675721066,
    lng: 126.96482309799062,
  },
  {
    title: "서울역",
    address: "서울",
    lat: 37.55603530641194,
    lng: 126.97228481374607,
  },
];

let markerList = [];
let infowindowList = [];

const getClickHandler = (i) => () => {
  const marker = markerList[i];
  const infowindow = infowindowList[i];

  // 만약 인포윈도우가 지도 위에 표시 되어 있다면
  // 마커를 클릭 시 인포윈도우를 사라지게 함
  if (infowindow.getMap()) {
    infowindow.close();
  }
  // 닫혀있다면 해당 마커위애
  // 인포윈도우 표시
  else {
    infowindow.open(map, marker);
  }
};

const getClickMap = (i) => () => {
  const infowindow = infowindowList[i];

  // 지도를 눌렀을 때의 경우
  // 인포윈도우가 열려있는지 유무는 중요하지 않기 때문에
  // 이와 같이 코드를 작성한다.
  infowindow.close();
};

// 위의 함수는 아래와 같다
// function getClickHandler(i){
//     return function(){

//     }
// }

for (let i in data) {
  const target = data[i];
  const latlng = new naver.maps.LatLng(target.lat, target.lng);

  let marker = new naver.maps.Marker({
    map,
    position: latlng,
    icon: {
      // css로 마커모양 커스티마이징
      content: `<div class="marker"></div>`,

      // anchor는 marker의 넓이와 높이의 2분의1로 설정
      anchor: new naver.maps.Point(7.5, 7.5),
    },
  });

  const content = `
   <div class="infowindow_wrap">
        <div class="infowindow_title">${target.title}</div>
        <div class="infowindow_address">${target.address}</div>
    </div>`;

  const infowindow = new naver.maps.InfoWindow({
    content,
    backgroundColor: "#00ff0000",
    borderColor: "#00ff0000",

    // 인포윈도우에 기본적으로 제공되는
    //  말풍선처럼 제공되는 꼬리표는 필요없기에 0,0으로 설정
    anchorSize: new naver.maps.Size(0, 0),
  });

  // 생성한 마커 push
  markerList.push(marker);
  // 생성한 infowindowList push
  infowindowList.push(infowindow);
}

for (let i = 0, li = markerList.length; i < li; i++) {
  naver.maps.Event.addListener(markerList[i], "click", getClickHandler(i));
  naver.maps.Event.addListener(map, "click", getClickMap(i));
}
