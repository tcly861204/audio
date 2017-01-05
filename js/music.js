/**
 * Created by Administrator on 2016/9/25.
 */
(function(W){
    var _Music = {
        getId:function(id){
            return document.getElementById(id);
        },
        getClass:function(className,preNode){
            var node = null;
            var temps = [];
            if (preNode != undefined) {
                node = preNode;
            } else {
                node = document;
            }
            var re=new RegExp('\\b' +className+ '\\b','i');
            var all = node.getElementsByTagName('*');
            for (var i = 0; i < all.length; i ++) {
                if(re.test(all[i].className)){
                    temps.push(all[i]);
                }
            }
            return temps;
        },
        addClass:function(node,className,changeClassName){
            var arr = node.className.split(' ');
            var indexX = arr.indexOf(changeClassName);
            if(indexX>-1){
                arr[indexX] = className;
            }
            node.className = arr.join(' ');
        },
        changeNum:function(num){
            if(num*1>9){
                return num;
            }else{
                return '0'+num;
            }
        },
        stopPropagation:function(e) {   //阻止冒泡事件
            if (e.stopPropagation)
                e.stopPropagation();
            else
                e.cancelBubble = true;
        },
        step:1,
        flag:false,
        rotateNum:0,
        audioTimer:null,
        audioDuration:0,
        soundCtrFlag:false,
        soundStep:0,
        init:function(){
            this.audio = this.getClass('audio-music')[0];
            this.QQ = this.getClass('qq')[0];
            this.audios();
            this.Events();
            this.ImgRotate = false;
            var _this = this;
            _this.audioMusic.addEventListener('timeupdate',function(){
                _this.audioDuration = parseInt(_this.audioMusic.duration,10);
                var cTime = parseInt(_this.audioMusic.currentTime,10);
                _this.audioLine.style.width = parseInt((cTime/_this.audioDuration)*250,10)+'px';
                if(_this.audioDuration && typeof _this.audioDuration=='number') {
                    _this.audioTime.innerHTML = _this.changeNum(Math.floor((_this.audioDuration - cTime) / 60)) + ':' + _this.changeNum((_this.audioDuration - cTime) % 60);
                }
                if(!_this.ImgRotate) {
                    _this.ImgRotate = true;
                    _this._play();
                }
            });
            _this.audioMusic.addEventListener('waiting',function(){
                _this.ImgRotate = false;
                clearInterval(_this.audioTimer);
            },false);
            _this.audioMusic.addEventListener('ended',function(){
                _this.jump(true);
            },false);
        },
        audios:function(){
            this.audioMusic=this.getClass('audio-music')[0];
            this.audioImg = this.getClass('audio-img')[0].getElementsByTagName('img')[0];
            this.audioTitle = this.getClass('audio-title')[0];
            this.audioTime = this.getClass('audio-time')[0];
            this.audioImgBtn = this.getClass('audio-imgbtn')[0];
            this.audioLine = this.getClass('line-on')[0];
            this.sound = this.getClass('sound')[0];
            this.soundControl = this.getClass('sound-Control')[0];
            this.soundSlide = this.getClass('sound-slide')[0];
            this.audioFace();
        },
        audioFace:function(){
            this.audioImg.src=json[this.step-1].imgsrc;
            this.audioMusic.src=json[this.step-1].music;
            this.audioTitle.innerHTML = "<p>"+json[this.step-1].title+"</p><span>"+json[this.step-1].author+"</span>";
            this.audioTime.innerHTML = json[this.step-1].time;
        },
        jump:function(isNext){
            var _this = this;
            if(isNext){
                _this.step++;
                if(_this.step>json.length){
                    _this.step=1;
                }
            }else{
                _this.step--;
                if(_this.step<1){
                    _this.step=json.length;
                }
            }
            _this.rotateNum=0;
            _this.audioFace();
            _this.audioMusic.play();
            _this._play();
        },
        _play:function(){
            var _this = this;
            clearInterval(_this.audioTimer);
            _this.audioTimer = setInterval(function(){
                _this.rotateNum++;
                if(_this.rotateNum>=3600){
                    _this.rotateNum=1;
                }
                if(_this.flag){
                    _this.audioImg.style.WebkitTransform = "rotate("+Math.ceil(_this.rotateNum/10)+"deg)";
                    _this.audioImg.style.MozTransform = "rotate("+Math.ceil(_this.rotateNum/10)+"deg)";
                    _this.audioImg.style.OTransform = "rotate("+Math.ceil(_this.rotateNum/10)+"deg)";
                    _this.audioImg.style.transform = "rotate("+Math.ceil(_this.rotateNum/10)+"deg)";
                }
            },1);
        },
        Events : function(){
            var _this = this;
            this.audioUp = this.getClass('audio-up')[0];
            this.audioPlay = this.getClass('audio-play')[0];
            this.audioNext = this.getClass('audio-next')[0];
            this.audioPlay.onclick = function(){
                var that = this;
                if(!_this.flag){
                    _this.addClass(that,'btn-on','btn-off');
                    _this.addClass(_this.audioImgBtn,'imgbtn-on','imgbtn-off');
                    _this.audioMusic.play();
                    _this.flag = true;
                }else{
                    _this.audioMusic.pause();
                    _this.addClass(that,'btn-off','btn-on');
                    _this.addClass(_this.audioImgBtn,'imgbtn-off','imgbtn-on');
                    _this.flag = false;
                }
            };
            this.audioImgBtn.onclick = function(){
                var that = this;
                if(!_this.flag){
                    _this.addClass(that,'imgbtn-on','imgbtn-off');
                    _this.addClass(_this.audioPlay,'btn-on','btn-off');
                    _this.audioMusic.play();
                    _this.flag = true;
                }else{
                    _this.audioMusic.pause();
                    _this.addClass(that,'imgbtn-off','imgbtn-on');
                    _this.addClass(_this.audioPlay,'btn-off','btn-on');
                    _this.flag = false;
                }
            };
            this.audioUp.onclick = function(){
                if(_this.flag){
                    _this.jump(false);
                }
            };
            this.audioNext.onclick = function(){
                if(_this.flag){
                    _this.jump(true);
                }
            };
            this.soundSlide.onmousedown = function(e){
                var ev = e || window.event;
                var that=this,
                disX=e.clientX-that.offsetLeft,
                disY=e.clientY-that.offsetTop;
                document.onmousemove = function(e){
                    var ev = e || window.event;
                    var T=e.clientY-disY-50;
                    that.style.left=0+"px";
                    if(T<=-50){
                        T=-50;
                    }else if(T>=0){
                        T=0;
                    }
                    _this.audioMusic.volume=(T/-50).toFixed(1);
                    _this.soundSlide.style.top=Math.floor(T)+"px";
                    _this.stopPropagation(ev);
                };
                document.onmouseup=function(e){
                    var ev = e || window.event;
                    document.onmousemove=null;
                    document.onmouseup=null;
                    _this.stopPropagation(ev);
                };
                _this.stopPropagation(ev);
            };
            this.sound.onclick = function(e){
                var ev = e || window.event;
                if(_this.flag){
                    _this.soundStep++;
                    switch(_this.soundStep){
                        case 1:
                            _this.soundCtrFlag = true;
                            _this.audioMusic.volume = 1;
                            _this.soundControl.style.display="block";
                            _this.addClass(this,'sound-on','sound-off');
                            break;
                        case 2:
                            _this.soundCtrFlag = false;
                            _this.soundControl.style.display="none";
                            break;
                        case 3:
                            _this.audioMusic.volume=0;
                            _this.soundStep = 0;
                            _this.addClass(this,'sound-off','sound-on');
                            break;
                    }
                    _this.stopPropagation(ev);
                }
            };
            document.onclick = function(e){
                var ev = e || window.event;
                if(_this.flag && _this.soundCtrFlag){
                    _this.soundCtrFlag = false;
                    _this.soundControl.style.display="none";
                    _this.stopPropagation(ev);
                }
            };
            this.QQ.onclick = function(){
                window.location.href="http://wpa.qq.com/msgrd?v=3&uin=1575259223&site=qq&menu=yes";
            };
        }
    };
    W.Music = _Music;
})(window);
window.onload = function() {
    Music.init();
};