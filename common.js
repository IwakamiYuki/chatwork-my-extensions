var isSearching = false;
var main = function() {
	addMyButton();

	// room-listの検索
	var roomListHeaderHtml = '<div class="roomListHeader mySearch"><input type="search" placeholder="グループ名で絞り込み...（ctrl+i）" style="width: 100%; border-top: none; border-right: none; border-bottom: 1px solid rgb(204, 204, 204); border-left: none; border-image: initial; box-shadow: none;"></div>'
	$('#_sideContentMenu__header').after(roomListHeaderHtml)
	$('.mySearch').keyup(function(e) {
		var texts = $('.mySearch input').val().split(' ')
		var result = new Array()
		for (var i = 0; i < texts.length; i++) {
			result[i] = MigemoJS.getRegExp (texts[i]);
		}
		var memberList = $('.roomListItem');
		for (var i = 0; i < memberList.length; i++) {
			var member = memberList.eq(i);
			var name = member.find('.roomListItem__roomName').text();
			member.show();
			for (var j = 0; j < texts.length; j++) {
				if(!name.toLowerCase().match(result[j])) {
					member.hide();
					break;
				}
			}
		}
	});

	/**
	* キーを押したときの処理
	*/
	document.onkeydown = function (e){
		// TO圧縮
		if (e.ctrlKey && e.key==',') {
			var e = document.getElementById('_chatText')
			if (e.value.length > 0) {
				e.value=e.value.replace(/(^\[To\:[0-9]+\]).+[\s\S]/gm,'$1');
			} else {
				e.value='[toall]'
			}
			document.getElementsByClassName('to-asshuku')[0].click();
		}
		// title~codeをつける
		if (e.ctrlKey && e.key=='.') {
			selectedText2InfoText();
		}

		// ctrl + i でグループ名で絞り込み。入力後、Enterキーでその部屋を表示する。
		if (e.ctrlKey && e.key=='i') {
			document.getElementsByClassName('roomListHeader')[1].children[0].focus();
			$('.roomListHeader input').css('background', 'pink')
			isSearching = true;
			roomMoreButtonClick();
		}
		if (isSearching && e.key == 'Enter') {
			isSearching = false;
			var roomItemList = $('.roomListItem')
			for (var i = 0; i < roomItemList.length; i++) {
				if (roomItemList[i].style.length == 0) {
					roomItemList[i].click();
					break;
				}
			}
			document.getElementsByClassName('roomListHeader')[1].children[0].blur();
			$('.roomListHeader input').css('background', '')
		}
	};

	///// エモーションの追加
	// (gogo)
	var addedEmotion = document.createElement('li').cloneNode(true)
	addedEmotion. setAttribute('class', 'emoticonTooltip__emoticonContainer')
	addedEmotion.innerHTML = '<img src="https://assets.chatwork.com/images/emoticon2x/emo_gogo.gif" alt="(gogo)" data-cwtag="(gogo)" title="いけいけ！" class="emoticonTooltip__emoticon">'
	document.getElementById('_emoticonGallery').appendChild(addedEmotion)
	// (ec14)
	addedEmotion = document.createElement('li') .cloneNode(true)
	addedEmotion. setAttribute('class', 'emoticonTooltip__emoticonContainer')
	addedEmotion.innerHTML = '<img src="https://assets.chatwork.com/images/emoticon2x/emo_ceo.gif" alt="(ec14)" data-cwtag="(ec14)" title="EC14" class="emoticonTooltip__emoticon">'
	document.getElementById('_emoticonGallery').appendChild(addedEmotion)
}


/**
 * カスタムボタンを設置する
 */
var addMyButton = function(){
	//  TO圧縮ボタンの設置
	var span = document.createElement('span');
	span.textContent = 'TOALL 圧縮(カンマ)';
	span.className='to-asshuku button';
	span.onclick = function() {
		var e = document.getElementById('_chatText')
		if (e.value.length > 0) {
			e.value=e.value.replace(/(^\[To\:[0-9]+\]).+[\s\S]/gm,'$1');
		} else {
			e.value='[toall]'
		}
	}
	element = document.getElementById('_sendEnterActionArea')
	element.parentNode.insertBefore(span, element);

	// キレイにするやつ
	span = document.createElement('span');
	span.textContent = '[info](ドット)';
	span.className='to-asshuku button';
	span.onclick = selectedText2InfoText;
	element = document.getElementById('_sendEnterActionArea')
	element.parentNode.insertBefore(span, element);
}

/**
 * 1行目タイトル、2行目移行内容に変換する
 */
var selectedText2InfoText = function() {
	var chatTextNode = document.getElementById('_chatText');
	var chatTextValue = chatTextNode.value;
	var startPos = chatTextNode.selectionStart;
	var endPos = chatTextNode.selectionEnd;
	if (startPos == endPos) {
			return;
	}

	var chatTextList = chatTextValue.substring(startPos,endPos).split('\n');
	var infoText = '[info]';
	if (chatTextList.length > 1){
		var titleTextFlag = true;
		for (var i = 0; i < chatTextList.length; i++){
			if (titleTextFlag) {
				infoText += '[title]' + chatTextList[i] + '[/title]';
				titleTextFlag = false;
				continue;
			}
			infoText += chatTextList[i] + '\n';
		}
		infoText = infoText.substr(0, infoText.length - 1) + '[/info]';
	} else {
		infoText += chatTextList[0] + '[/info]';
	}
	chatTextNode.value = chatTextValue.substring(0, startPos) + infoText + chatTextValue.substring(endPos, chatTextValue.length);
}

var roomMoreButtonClickCount = 0;
/**
 * グループ一覧を全部読み込む
 */
var roomMoreButtonClick = function() {
	if (roomMoreButtonClickCount >= 2) return; // 開きすぎると重くなっちゃうので2回くらいで止めておく
	roomMoreButtonClickCount++
	$('.roomLimitOver div').click()
	if (document.getElementById('_roomMore')) setTimeout(roomMoreButtonClick,100);
}


var startCnt = 0;
var start = function() {
	if (startCnt++ > 30) return;
	if ($('#_roomListArea').length == 0) {
		setTimeout(start, 100);
	} else {
		main();
	}
}
start();
