const searchPlaces = () => {
  // jquery 문법으로 upload.ejs의
  // input tag의 id 값이 keyword인 value를 가져온다.
  let keyword = $("#keyword").val();
  ps.keywordSearch(keyword, placeSearchCB);
};

const onSubmit = (title, address, lat, lng) => {
  $.ajax({
    url: "/location",
    data: { title, address, lat, lng },
    type: "POST",
  })
    .done((response) => {
      console.log("데이터 요청 성공.");
      alert("성공");
    })
    .fail((error) => {
      console.log("데이터 요청 실패");
      alert("실패");
    });
};

const displayInfowindow = (marker, place_name, address_name, lat, lng) => {
  let content = ` 
  <div style="padding:25px;">
    ${place_name}<br>
    ${address_name} <br>
    <button onClick="onSubmit('${place_name}', '${address_name}', ${lat}, ${lng});">등록</button>
  </div>
  `;

  // 지도 중심을 부드럽게 이동시킵니다
  // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
  // https://apis.map.kakao.com/web/sample/moveMap/
  map.panTo(marker.getPosition());

  infowindow.setContent(content);
  infowindow.open(map, marker);
};

const removeAllChildNodes = (el) => {
  // child node가 있으면 true 반환
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
};

const removeMarker = () => {
  for (let i = 0; i < markerList.length; i++) {
    // null 을 지정하면 마커를 제거한다.
    markerList[i].setMap(null);
  }
  markerList = [];
};

// LatLngBounds
// https://apis.map.kakao.com/web/sample/setBounds/
const displayPlaces = (data) => {
  let listEl = document.getElementById("placesList");
  // 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체를 생성합니다
  let bounds = new daum.maps.LatLngBounds();

  // 검색리스트 초기화
  removeAllChildNodes(listEl);
  // marker 초기화
  removeMarker();

  for (let i = 0; i < data.length; i++) {
    let lat = data[i].y;
    let lng = data[i].x;
    let address_name = data[i]["address_name"];
    let place_name = data[i]["place_name"];

    // 지도 범위를 재설정합니다
    const placePosition = new daum.maps.LatLng(lat, lng);
    // LatLngBounds 객체에 좌표를 추가합니다
    bounds.extend(placePosition);

    // 마커를 지도에 추가합니다
    let marker = new kakao.maps.Marker({ position: placePosition });
    marker.setMap(map);
    markerList.push(marker);

    const el = document.createElement("div");
    const itemStr = `
    <div class=info>
      <div class="info_title">
        ${place_name}
      </div>
      <span>${address_name}</span>
    </div>`;

    el.innerHTML = itemStr;
    el.className = "item";

    daum.maps.event.addListener(marker, "click", function () {
      displayInfowindow(marker, place_name, address_name, lat, lng);
    });

    el.onclick = function () {
      displayInfowindow(marker, place_name, address_name, lat, lng);
    };

    listEl.appendChild(el);
  }

  daum.maps.event.addListener(map, "click", function () {
    infowindow.close();
  });
  map.setBounds(bounds);
};

const placeSearchCB = (data, status) => {
  if (status === daum.maps.services.Status.OK) {
    console.log(data);
    displayPlaces(data);
  } else if (status === daum.maps.services.Status.ZERO_RESULT) {
    alert("검색 결과가 존재하지 않습니다.");
    return;
  } else if (status === daum.maps.services.Status.ERROR) {
    alert("검색 결과 중 오류가 발생하였습니다.");
    return;
  }
};

const mapContainer = document.getElementById("map");
const mapOption = {
  // 서울역 좌표
  center: new daum.maps.LatLng(37.554477, 126.970419),
  // 확대 레벨
  level: 3,
};

let map = new daum.maps.Map(mapContainer, mapOption);

// https://apis.map.kakao.com/web/documentation/#InfoWindow
let infowindow = new daum.maps.InfoWindow({
  zIndex: 1,
});

let markerList = [];

let ps = new daum.maps.services.Places();

searchPlaces();
