var range = document.getElementById('range');
var select = document.getElementById('select-title');
var min = document.getElementById('min');
var btnStart = document.getElementById('button-start');
var btnPrev = document.getElementById('button-previous');
var btnNext = document.getElementById('button-next');
var btnEnd = document.getElementById('button-end');

var text = "";
var title = "";
var minChecked = false;
var prec = 0.5;
var selectFrom = 0;
var offset = 20;
var dObject = [];
var recommended = [];
var recommendedSpecial = [];
var base = [];
var baseSpecial = [];


btnPrev.addEventListener('click', function() {
  selectFrom = selectFrom - 20;
  if(selectFrom < 0) {
    selectFrom = dObject.length - 20;
  }
  setArticles();
})

btnNext.addEventListener('click', function() {
  selectFrom = selectFrom + 20;
  if(selectFrom + offset >= dObject.length) {
    selectFrom = 0;
  }
  setArticles();
})

btnStart.addEventListener('click', function() {
  selectFrom = 0;
  setArticles();
})

btnEnd.addEventListener('click', function() {
  selectFrom = dObject.length - 20;
  setArticles();
})


function displayLabel (data = [], nodeId){
  var node = document.getElementById(nodeId);
  node.innerHTML = "";
  if(minChecked) {
    for(var i = 0; i < data.length && i < 3; i++) {
       node.appendChild(setLabel(data[i]));
    }

    for(var i = 3; i < data.length; i++) {
      if(data[i].prec !== undefined) {
        if(data[i].prec >= prec) {
          node.appendChild(setLabel(data[i]));
        }
      } else {
       node.appendChild(setLabel(data[i]));
      }
    }
  } else {
    for(var i = 0; i < data.length; i++) {
      if(data[i].prec !== undefined) {
        if(data[i].prec >= prec) {
          node.appendChild(setLabel(data[i]));
        }
      } else {
       node.appendChild(setLabel(data[i]));
      }
    }
  }
 }

function setLabel(data){
  var list = document.createElement('li');
  if (data.prec !== undefined) {
    list.textContent = `${data.label} ${data.prec}`;
  }else {
    list.textContent = data.label;
  }
  return list;
}

min.addEventListener('change', function() {
  minChecked = !minChecked;
  displayLabel(base, "base-labels");
  displayLabel(recommended, "recommended-labels");
  displayLabel(recommendedSpecial, "recommended-spec-labels");
  displayLabel(baseSpecial, "base-spec-labels");

});

(function () {
  fetchFromText();
  prec = range.value;
  document.getElementById('range-value').textContent = range.value;
})();

select.addEventListener('change', function(e) {
  var option = dObject.find(d => d.title == e.target.value);
  getDataFromText(option);
});

range.addEventListener('input', function(e) {
  prec = e.target.value;
  document.getElementById('range-value').textContent = e.target.value;
  displayLabel(base, "base-labels");
  displayLabel(recommended, "recommended-labels");
  displayLabel(recommendedSpecial, "recommended-spec-labels");
  displayLabel(baseSpecial, "base-spec-labels");

  
  
});

function setArticles(){
  select.innerHTML = "";
  dObject.map((data, index) => {
    if(index >= selectFrom && index < (selectFrom + offset)) {
      let option = document.createElement('option');
      option.innerText = data.title;
      option.value = data.title;
      select.appendChild(option);
    }
  });
  select.selectedIndex = 0;
  onSelectionChange(select.value);
};

function onSelectionChange(data){
  const option = dObject.find(d => d.title == data);
  getDataFromText(option);
}

function fetchFromText(url = 'data.txt') {
  dObject = [];
  fetch(url)
    .then((response) => response.text())
    .then((text) => text.split('\n'))
    .then((text) => text.map((line) => line.split('$$$')))
    .then((text) => {
      var obj = {};
      var index = 0;
      text.forEach((line) => {
        obj.recommended = line[0];
        obj.recommendedSpec = line[1];
        obj.base = line[2];
        obj.title = line[3];
        obj.text = line[4];
        obj.id = index++;

        dObject.push(obj);
        obj = {};
      });
      select.innerHTML = "";

      dObject.map((data, index) => {
        if(index >= selectFrom && index < (selectFrom + offset)) {
          var option = document.createElement('option');
          option.innerText = data.title;
          option.value = data.title;
          select.appendChild(option);
        }
      })
    });
};


function getDataFromText(data) {
  recommended = [];
  recommendedSpecial = [];
  base = [];
  baseSpecial = [];
  var tempObj = {};
  var recommendedArray = data.recommended.split(' '); 
  var recommendedSpec = data.recommendedSpec.split(' '); 
  var baseArray = data.base.split(' ');
  text = data.text;
  title = data.title;
  
  recommendedArray.forEach(item => {
    if(item.trim().startsWith('__label__')) {
      tempObj.label = item.replace("__label__", "").replace(/@{2}/g, " ");
    }else if(item != "") {
      tempObj.prec = item.trim();
      recommended.push(tempObj);
      tempObj = {};
    }
  });

  recommendedSpec.forEach(item => {
    if(item.trim().startsWith('__label__')) {
      tempObj.label = item.replace("__label__", "").replace(/@{2}/g, " ");
    }else if(item != "") {
      tempObj.prec = item.trim();
      recommendedSpecial.push(tempObj);
      tempObj = {};
    }
  });
  baseArray.forEach(item => {
    if(item.trim().startsWith('__label__')) {
      tempObj.label = item.replace("__label__", "").replace(/@{2}/g, " ");
      base.push(tempObj);
      tempObj = {};
    }else if(item != "") {
      tempObj.label = item.replace(/@{2}/g, " ");
      baseSpecial.push(tempObj);
      tempObj = {};
    }
  });

  var content = document.getElementById("text-content");
  content.innerHTML = text;
  
  displayLabel(base, "base-labels");
  displayLabel(recommended, "recommended-labels");
  displayLabel(recommendedSpecial, "recommended-spec-labels");
  displayLabel(baseSpecial, "base-spec-labels");

}
