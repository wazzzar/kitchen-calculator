// ДОРОГОЙ ДРУГ, если хочешь сохранить здравие ума своего, не читай этот ГОВНОКОД
$(document).ready(function(){
	let $ = jQuery;
	// настройка ползунков
	let size_input1 = $('#size_input_L1');
	size_input1.slider({ range: "min", min: 3000, max: 3500, step: 10, value: 3090,
		slide: function(event, ui){
			$("#L1_size").html($(this).slider("value"));
			calculate();
		}
	});
	$('#size_input_L1 a').append('<span id="L1_size"></span><b class="dot"></b><b class="line"></b>');
	$("#L1_size").html(size_input1.slider("value"));
	
	let size_input2 = $('#size_input_L2');
	size_input2.slider({ range: "min", min: 1320, max: 1750, step: 10, value: 1590,
		slide: function(event, ui){
			$("#L2_size").html($(this).slider("value"));
			calculate();
		}
	});
	$('#size_input_L2 a').append('<span id="L2_size"></span><b class="dot"></b><b class="line"></b>');
	$("#L2_size").html(size_input2.slider("value"));

	// переменные
	let CV = { // текущие значения
			// настройки для нераздельных элиментов
			kitchen_type: "Угловая",
			facade_type: "Классика",
			glass_color: "Вулкан_бронза",
			body_color: "Ольха",
			washing_type: "GAP465.488",
			handles_type: "RR002ST",
			hinges_type: "С_доводчиками",

			// тип столешницы, цвет по умолчанию
			worktop_type: "Пластик", worktop_color: "Саломея",
			// для сохранения при смене типа столешницы
			worktop_stolex_col: "Саломея", worktop_stone_col: "Драгоценный_камень",

			// тип фартука, цвет по умолчанию
			apron_type: "Пластик", apron_color: "ЛаСкала",
			// для сохранения при смене типа фартука
			apron_stolex_col: "ЛаСкала", apron_photo_col: "Город",

			// тип дверки, настрйка позиции для изменения цвета, цвет для низа и верха по умолчанию
			door_type: "Классика", door_pos: "ВерхниеНижние", door_top: "Береза_розовая", door_bot: "Береза_розовая",
			// для сохранения при смене типа дверок
			door_dir_col: { door_top: "Вишневый_глянец", door_bot: "Оранжевый_глянец" },
			door_cla_col: { door_top: "Береза_розовая", door_bot: "Береза_розовая" },

			// категории
			dsp_cat: "2кат",
			// dsp_top_cat: "2кат", dsp_bot_cat: "2кат",
			mdf_top_cat: "2кат", mdf_bot_cat: "2кат",
			gls_cat: "1кат",
			wt_cat: "Пластик",
			ap_cat: "Пластик"
		},
		// !!! цены загружаются с базы и переустанавливаются в другие значения
		// эти значения для отладки
		P = { // цены
			Rdsp: {}, // ДСП - корпус
			Rmdf: {}, // МДФ - дверки
			Rdvp: 1, // ДВП
			Rwt: {}, // Столешница
			Rapr: {}, // Фартук
			Rgls: {}, // Стекло
			Nhnd: 17, Rhnd: {}, // Ручки
			Rwsh: {}, // Мойка
			Rhgs: {}, // Петли
			Rlft: 50, // Лифты
			Rblm: 1, // блумы
			Rbxs: {}, // Ящики
			Rclr: 40, // Доводчик
			Nlgs: 18, Rlgs: 20, // Ножки
			Nfix: 6, Rfix: 40, // Крепеж
		}
	// смотри..., ещё не поздно остановиться
	// вывод объекта в текстовом виде
	function printObj(obj, j){
		let str = "", i = 0;
		for (k in obj){
			if (typeof obj[k] == "object") str += "\n"+k+": "+printObj(obj[k], 1);
									  else str += ( (j && obj.length !== i) ? "\n\t" : "\n")+k+": "+obj[k];
			i++;
		}
		return str;
	}

	// загружаем цены
	$.get("get_prices.php",
		function(data){
			//console.log(data);
			for (let i = 0; i < data.length; i++){
				let item = data[i];
				item.price = parseFloat(item.price);
				switch(item.part){
					case "ДСП"		  : P.Rdsp[item.type] = item.price; break;
					case "МДФ"		  : P.Rmdf[item.type] = item.price; break;
					case "Столешница" : P.Rwt [item.type] = item.price; break;
					case "Фартук"	  : P.Rapr[item.type] = item.price; break;
					case "Стекло"	  : P.Rgls[item.type] = item.price; break;
					case "Ручка"	  : P.Rhnd[item.type] = item.price; break;
					case "Мойка"	  : P.Rwsh[item.type] = item.price; break;
					case "Петля"	  : P.Rhgs[item.type] = item.price; break;
					case "Ящик"		  : P.Rbxs[item.type] = item.price; break;
					case "ДВП"		  : P.Rdvp            = item.price; break;
					case "Лифты"	  : P.Rlft            = item.price; break;
					case "Blum"		  : P.Rblm            = item.price; break;
					case "Доводчик"	  : P.Rclr            = item.price; break;
					case "Ножки"	  : P.Rlgs            = item.price; break;
					case "Крепеж"	  : P.Rfix            = item.price; break;
				}
			}
			//console.log(printObj(P));
			set_default();
		}
	);
	// функция расчета стоимости
	function calculate(){
		// Доставка и Установка
		let DAI = 1;
		DAI += $('#delivery').prop('checked') ? 0.03 : 0;
		DAI += $('#install' ).prop('checked') ? 0.1 : 0;
		//console.log(DAI);
		// разница из размеров
		let L1 = size_input1.slider("value"), L2 = size_input2.slider("value"), L1L2 = L1 + L2;
		let L01 = 2350, L02 = 1320;
		let diffL1L01 = L1 - L01, diffL2L02 = L2 - L02, diffL1 = diffL1L01/1000, diffL2 = diffL2L02/1000;
		//console.log(diffL1, diffL2);

		// ДСП
		let S1Bdsp = 4.96 + diffL1 * 0.873, S2Bdsp = 2.53 + diffL2 * 2.07,
			S1Tdsp = 4.97 + diffL1 * 1.236, S2Tdsp = 1.88 + diffL2 * 1.791;
		let DSP = (S1Bdsp + S2Bdsp + 0.47) * P.Rdsp[CV.body_color] + (S1Tdsp + S2Tdsp) * P.Rdsp[CV.body_color];
		//console.log(DSP);

		// МДФ
		let S1Bmdf = 1.06 + diffL1 * 0.455, S2Bmdf = 0.46 + diffL2 * 0.326,
			S1Tmdf = 1.56 + diffL1 * 0.673, S2Tmdf = 0.42 + diffL2 * 0.349;
		let MDF = (S1Bmdf + S2Bmdf) * P.Rmdf[CV.door_bot] + (S1Tmdf + S2Tmdf) * P.Rmdf[CV.door_top];
		//console.log(MDF);

		// ДВП
		let S1dvp = 2.6 + diffL1 * 0.9090, S2dvp = 0.8 + diffL2 * 0.6977;
		let DVP = (S1dvp + S2dvp) * P.Rdvp;
		//console.log(DVP);

		let TW  = P.Rwt[CV.worktop_color] * (CV.worktop_type === "Пластик" ? 2 : (L1L2 - 600)/1000 * 0.6); // Столешница
		let APR = P.Rapr[CV.apron_color] * (CV.apron_type === "Пластик" ? 2 : L1L2/1000) /* (CV.apron_type == "Без фартука" ? 0 : 1)*/; // Фартук
		let GLS = (0.3 + diffL1 * 0.2727) * P.Rgls[CV.glass_color]; // Стекло
		let HND = P.Nhnd*P.Rhnd[CV.handles_type]; // Ручки
		let WSH = P.Rwsh[CV.washing_type]; // Мойка
		let HGS = 12*P.Rhgs["110"+CV.hinges_type] + 2*P.Rhgs["45"+CV.hinges_type] + 2*P.Rhgs["90"+CV.hinges_type] + P.Rblm; // Петли
		let BXS = P.Rbxs["85"]+P.Rbxs["85+1p"]+P.Rbxs["85+2p"]+P.Rbxs["53"]+(CV.hinges_type === "С_доводчиками" ? 5*P.Rclr : 0); // Ящики
		let LGS = P.Nlgs*P.Rlgs; // Ножки
		let FIX = P.Nfix*P.Rfix; // Крепеж
		//console.log(TW, APR, GLS, HND, WSH, HGS, BXS, LGS, FIX);
		// Ящик над холодильником
		let BOR = $("#above_refreg").prop("checked") ? (0.59*P.Rdsp[CV.body_color] + 0.21*P.Rdvp + 0.21*P.Rmdf[CV.door_top] +
					P.Rhnd[CV.handles_type] + 2*P.Rhgs["110"+CV.hinges_type] + 2*P.Rlft) : 0;
		//console.log(BOR);
		let TP  = (parseFloat(DSP)+parseFloat(DVP)+parseFloat(MDF)+parseFloat(TW )+parseFloat(APR)+parseFloat(GLS)+parseFloat(HND)+
				  parseFloat(WSH)+parseFloat(HGS)+parseFloat(BXS)+parseFloat(LGS)+parseFloat(FIX)+parseFloat(BOR)
				)*parseFloat(DAI);
		//console.log(TP);
		$("#TP_span").html( accounting.formatNumber(TP, 2, " ", ".")+' руб.');
		// console.log(
		// 	"DSP: "+DSP+"\n"+
		// 	"DVP: "+DVP+"\n"+
		// 	"MDF: "+MDF+"\n"+
		// 	"TW: " +TW +"\n"+
		// 	"APR: "+APR+"\n"+
		// 	"GLS: "+GLS+"\n"+
		// 	"HND: "+HND+"\n"+
		// 	"WSH: "+WSH+"\n"+
		// 	"HGS: "+HGS+"\n"+
		// 	"BXS: "+BXS+"\n"+
		// 	"LGS: "+LGS+"\n"+
		// 	"FIX: "+FIX+"\n"+
		// 	"BOR: "+BOR+"\n"
		// );
	}
	// !!! УЧТИТЕ, я НЕ несу ответственность за ваше психическое здоровье
	// формирует путь до слоя чтоб вставить его в src у img
	function set_layer_url(attr){
		let layer_url, module_url, url = './img/Кухни/'+CV['kitchen_type'];
		if(attr.search("facade") !== -1){ // для фасада
			layer_url = url+'/Фрезеровки/'+CV['facade_type']+'.png';
			module_url = url+'/Фрезеровки/Модуль/'+CV['facade_type']+'.png';
		}
		if(attr.search("door") !== -1){ // для дверок
			top_url = url+'/Дверьки/'+CV['door_type']+'/Верхние/'+CV['door_top']+'.png';
			bot_url = url+'/Дверьки/'+CV['door_type']+'/Нижние/'+CV['door_bot']+'.png';
			module_url = url+'/Дверьки/Модуль/'+CV['door_type']+'/'+CV['door_top']+'.png';
			
			if(CV['door_pos'] === "ВерхниеНижние"){
				$('#doortop_layer').attr('src', top_url);
				$('#doorbottom_layer').attr('src', bot_url);
			}else{
				if(CV['door_pos'] === "Верхние") $('#doortop_layer').attr('src', top_url);
										   else $('#doorbottom_layer').attr('src', bot_url);
			}

			$('#door_module_layer').attr('src', module_url);
			calculate();
			return;
		}
		if(attr.search("body") !== -1){ // для корпуса
			layer_url = url+'/Корпус/'+CV['body_color']+'.png';
			module_url = url+'/Корпус/Модуль/'+CV['body_color']+'.png';
		}
		if(attr.search("worktop") !== -1){ // столешница
			layer_url = url+'/Столешки/'+CV['worktop_type']+'/'+CV['worktop_color']+'.png';
		}
		if(attr.search("apron") !== -1){ // фартук
			layer_url = url+'/Фартук/'+CV['apron_type']+'/'+CV['apron_color']+'.png';
		}
		if(attr.search("washing") !== -1){ // мойка
			layer_url = url+'/Мойки/'+CV['washing_type']+'.png';
		}
		if(attr.search("glass") !== -1){ // стекло
			layer_url = url+'/Стекла/'+CV['glass_color']+'/'+CV['facade_type']+'.png';
		}
		if(attr.search("handles") !== -1){ // ручки
			layer_url = url+'/Ручки/'+CV['handles_type']+'.png';
			module_url = url+'/Ручки/Модуль/'+CV['handles_type']+'.png';
		}
		$('#'+attr.split("_")[0]+'_layer').attr('src', layer_url);
		$('#'+attr.split("_")[0]+'_module_layer').attr('src', module_url);
		calculate();
	}

	// установка значений по умолчанию
	function set_default(){
		// добавление класса элименту выпадающего списка чтоб выделить его как текущий
		$('ul#facade_type > li:contains('+CV['facade_type'].replace("_", " ")+')').addClass('curr_item');
		$('ul#worktop_type > li:contains('+CV['worktop_type']+')').addClass('curr_item');
		$('ul#apron_type > li:contains('+CV['apron_type']+')').addClass('curr_item');
		$('ul#hinges_type > li:contains('+CV['hinges_type'].replace("_", " ")+')').addClass('curr_item');
		// чекаем нужные инпуты
		$('input[id="'+CV['glass_color']+'"]').attr("checked", "checked");
		$('input[id="'+CV['body_color']+'"]').attr("checked", "checked");
		$('input[id="'+CV['worktop_color']+'"]').attr("checked", "checked");
	if(CV['door_top'] === CV['door_bot'])
		$('input[id="'+CV['door_top']+'"]').attr("checked", "checked");
		$('input[id*="'+CV['apron_color']+'_2"]').attr("checked", "checked");
		$('input[id="'+CV['washing_type']+'"]').attr("checked", "checked");
		$('input[id="'+CV['handles_type']+'"]').attr("checked", "checked");
		// установка слоев
		set_layer_url('body');
		set_layer_url('facade');
		set_layer_url('door');
		set_layer_url('glass');
		set_layer_url('handles');
		set_layer_url('worktop');
		set_layer_url('washing');
		set_layer_url('apron');
	}

// обработчики событий !!! ГОВНОКОД
	// элименты главного меню
	$('.select_menu_item').on("click", function(){
		// управление отображением кнопок выбора фасада для настройки
		$(".position_select").css("display", "none");

		// текст для вставки в заголовок панели настроек
		$('.type_select_panel h3').html(this.innerHTML.replace("_", " "));
		$('.type_select > div').css("display", "none");
		
		// скрываем все блоки и открываем нужные
		$('.type_select > div.'+this.id).css("display", "block");
		$('.'+this.id+' .first_colors').css("display", "block");
		$('.'+this.id+" .second_colors").css("display", "none");

		let id = this.id.split("_");
		id = id[0]+'_'+id[1];

		$('.select_item input[id="'+CV[id]+'"]').prop("checked", "checked");
		calculate();
	});
	// а вот теперь хана твоей психике АХААХАХАХАХАХ
	// элименты под меню
	$('.select_menu li').on("click", function(){
		// управление отображением кнопок выбора фасада для настройки
		let id = $(this).parent("ul.sub_menu").attr("id");
		$(".position_select").css("display", (id !== "facade_type") ? "none" : "block");

		// восстанавливаем вид панели при переходе между типами
		$('.'+id+' .first_colors').css("display", "block");
		$('.'+id+' .second_colors').css("display", "none");
		$('.select_item_arrow').removeClass("less_arrow");

		// текст для вставки в заголовок панели настроек
		let it = $(this).parents('li.has_sub_menu').text();
		it = it.split(" ")[0];
		$('.type_select_panel h3').html(it+": "+this.innerHTML);
		
		// скрываем все блоки и открываем нужные
		$('.type_select > div').css("display", "none");
		$('.type_select > div.'+id).css("display", "block");
		
		// скрываем блоки и открываем только нужные цвета !!!! ГОВНОКОДИЩЕ
		if(id === "facade_type"){
			// для фасадов
			$('.position_select input.selected').removeClass("selected");
			$('.position_select input[alt=ВерхниеНижние]').addClass("selected");
			CV[id] = this.innerHTML.replace(" ", "_");
			
			if(this.innerHTML === "Без фрезеровки"){
				CV["door_type"] = "Прямые";
				$('.facade_type > .direct_door').css("display", "block");
				$('.facade_type > .classic_door').css("display", "none");
				// swap
				if(!$(this).hasClass("curr_item")){
					CV["door_cla_col"]["door_top"] = CV["door_top"];
					CV["door_cla_col"]["door_bot"] = CV["door_bot"];
					CV["door_top"] = CV["door_dir_col"]["door_top"];
					CV["door_bot"] = CV["door_dir_col"]["door_bot"];
				}
			}else{
				CV["door_type"] = "Классика";
				$('.facade_type > .classic_door').css("display", "block");
				$('.facade_type > .direct_door').css("display", "none");
				// swap
				let obj = $(this).parent("ul.sub_menu").children("li.curr_item").html();
				if(!$(this).hasClass("curr_item") && obj === "Без фрезеровки"){
					CV["door_dir_col"]["door_top"] = CV["door_top"];
					CV["door_dir_col"]["door_bot"] = CV["door_bot"];
					CV["door_top"] = CV["door_cla_col"]["door_top"];
					CV["door_bot"] = CV["door_cla_col"]["door_bot"];
				}
			}
			recheck_input();
			set_layer_url('glass');
			set_layer_url('door');
		}
		if(id === "worktop_type"){
			// для столешницы
			if(this.innerHTML === "Искусственный камень"){
				$('.worktop_type > .stone').css("display", "block");
				$('.worktop_type > .stolex').css("display", "none");
				// swap
				if(!$(this).hasClass("curr_item")){
					CV["worktop_stolex_col"] = CV["worktop_color"];
					CV["worktop_color"] = CV["worktop_stone_col"];
				}
			}else{
				$('.worktop_type > .stone').css("display", "none");
				$('.worktop_type > .stolex').css("display", "block");
				// swap
				if(!$(this).hasClass("curr_item")){
					CV["worktop_stone_col"] = CV["worktop_color"];
					CV["worktop_color"] = CV["worktop_stolex_col"];
				}
			}
			// чекаем нужный инпут и меняет категорию столешки
			CV["wt_cat"] = $('.select_item input[id="'+CV["worktop_color"]+'"]').prop("checked", "checked").attr("class");
		}
		if(id === "apron_type"){
			// для фартука
			if(this.innerHTML === "Без фартука"){
				$("#apron_layer").css("display", "none");
				$('.apron_type > .photo').css("display", "none");
				$('.apron_type > .stolex').css("display", "none");
			}else{
				$("#apron_layer").css("display", "block");
			}
			
			if(this.innerHTML === "Фотопечать"){
				$('.apron_type > .photo').css("display", "block");
				$('.apron_type > .stolex').css("display", "none");
				// swap
				if(!$(this).hasClass("curr_item")){
					CV["apron_stolex_col"] = CV["apron_color"];
					CV["apron_color"] = CV["apron_photo_col"];
				}
				$('.select_item input[id="'+CV["apron_photo_col"]+'"]').prop("checked", "checked");
			}
			if(this.innerHTML === "Пластик"){
				$('.apron_type > .photo').css("display", "none");
				$('.apron_type > .stolex').css("display", "block");
				// swap
				if(!$(this).hasClass("curr_item")){
					CV["apron_photo_col"] = CV["apron_color"];
					CV["apron_color"] = CV["apron_stolex_col"];
				}
				$('.select_item input[id*="'+CV["apron_stolex_col"]+'_2"]').prop("checked", "checked");
			}
		}
		// делаем элимент списка текущим
		$(this).parent("ul.sub_menu").children("li.curr_item").removeClass("curr_item");
		$(this).addClass("curr_item");
		
		// сохранением настройки
		CV[id] = this.innerHTML.replace(" ", "_");
		set_layer_url(id);
	});
	// МУЖИК!!!, если хватило сил дочитать до сюда
	// элименты панели выбора
	$('.select_item input').on("change input", function(){ // oninput - special for Opera
		this.checked = "checked"; // special for Opera
		let name = this.name, val = this.value, cat = this.className;
		// если настрайвают фасад, то 
		if(name === "door_color"){
			// меняем только тот который выбран кнопкой
			if(CV['door_pos'] === "ВерхниеНижние"){
				CV["door_top"] = val;
				CV["door_bot"] = val;
				CV["mdf_top_cat"] = cat;
				CV["mdf_bot_cat"] = cat;
			}else{
				if(CV['door_pos'] === "Верхние"){
					CV["door_top"] = val;
					CV["mdf_top_cat"] = cat;
				}else{
					CV["door_bot"] = val;
					CV["mdf_bot_cat"] = cat;
				}
			}
			$('.select_item img').css("border-color", "#F0F0F0");
		// иначе просто что в имени то и меняем в объекте CV
		}else CV[name] = val;
		// меняем категорию Столешки, ДСП, Стекла
		if(name === "worktop_color") CV["wt_cat"] = cat;
		if(name === "body_color") CV["dsp_cat"] = cat;
		if(name === "glass_color") CV["gls_cat"] = cat;
		set_layer_url(name);
	});

	// стрелка в панели выбора
	$('.select_item_arrow').on("click", function(){
		let pc = $(this).parent("div").attr("class");
		// переключение стрелки
		if( $(this).hasClass("less_arrow") ){
			$(this).removeClass("less_arrow");
			$('.'+pc+' .first_colors').css("display", "block");
			$('.'+pc+' .second_colors').css("display", "none");
		}else{
			$(this).addClass("less_arrow");
			$('.'+pc+' .second_colors').css("display", "block");
			$('.'+pc+' .first_colors').css("display", "none");
		}
	});
	// ричекинг инпутов
	function recheck_input(){
		$('.select_item input:checked').removeAttr("checked");
		$('.select_item img').css("border-color", "#F0F0F0");

		CV['door_pos'] = $('.position_select input.selected').attr("alt");
		if(CV['door_pos'] === "ВерхниеНижние"){
			if(CV['door_top'] === CV['door_bot']){
				let cat = $('.select_item input[id="'+CV['door_top']+'"]').prop("checked", "checked").attr("class");
				CV["mdf_top_cat"] = cat;
				CV["mdf_bot_cat"] = cat;
			}else{
				let st = $('.select_item input[id="'+CV['door_top']+'"]');
				let sb = $('.select_item input[id="'+CV['door_bot']+'"]');
				CV["mdf_top_cat"] = $(st).attr("class");
				CV["mdf_bot_cat"] = $(sb).attr("class");
				$(st).prev().children("img").css("border-color", "#f00");
				$(sb).prev().children("img").css("border-color", "#f00");
			}
		}else{
			if(CV['door_pos'] === "Верхние")
				CV["mdf_top_cat"] = $('.select_item input[id="'+CV["door_top"]+'"]').prop("checked", "checked").attr("class");
			if(CV['door_pos'] === "Нижние")
				CV["mdf_bot_cat"] = $('.select_item input[id="'+CV["door_bot"]+'"]').prop("checked", "checked").attr("class");
		}
	}

	// выбора фасадов для настройки
	$('.position_select input').on("click", function(){
		$('.position_select input.selected').removeClass("selected");
		$(this).addClass("selected");
		recheck_input();
	});

	// отзеркаливание
	$('.mirror_toggle').on("change", function(){
		let bool = $("#above_refreg").prop("checked");
		if(!$('.layers_wrap').hasClass("mirrored") ){
			$('.layers_wrap').addClass('mirrored');
			$('.L1_control' ).css("margin-left", bool ? "0em" : "4.6em");
		}else{
			$('.layers_wrap').removeClass('mirrored');
			$('.L1_control' ).css("margin-left", "0em");
		}
		$(".controls .length_controle:first").before( $(".controls .length_controle:last").detach() );
	});

	// включение холодильника
	$("#above_refreg").on("change", function(){
		// расчет новых границ для ползунка L1
		let bool = $(this).prop("checked"), plus = 600*(bool ? 1 : -1),
			new_L1_min = size_input1.slider("option", "min")+plus,
			new_L1_max = size_input1.slider("option", "max")+plus;
		
		$("#L1_size").html( size_input1.slider({"min":new_L1_min,"max":new_L1_max}).slider("value") );
		$("#L1_start").html(new_L1_min);
		$("#L1_end").html(new_L1_max);
		
		$(".calc_view_port img[id*=module_]").css("display", bool ? "inline-block" : "none");

		size_input1.css("width", bool ? "17.6em" : "13.4em");
		$('.L1_control').css("width", bool ? "19.1em" : "14.5em");
		if( $('.layers_wrap').hasClass("mirrored") )
			$('.L1_control').css("margin-left", bool ? "0em" : "4.6em");
		calculate();
	});

	// включение доставка/установка
	$('#delivery, #install').on("change", function(){
		calculate();
	});

	// формирует строку описания текущих параметров кухни
	function get_kitchen_desc(){
		let str = "";
		str += "Направление кухни: "+$("label[for="+$('.mirror_toggle:checked').attr("id")+"]").html()+"\n";
		str += "Общая длина кухни: "+size_input1.slider("value")+" мм\n";
		str += "Длина угловой секции: "+size_input2.slider("value")+" мм\n";
		str += "Корпус: "+CV["body_color"].replace("_"," ")+"\n";
		str += "Фасад: "+CV["facade_type"].replace("_"," ")+"\n";
		str += "Дверьки верх: "+CV["door_top"].replace("_"," ")+"\n";
		str += "Дверьки низ: "+CV["door_bot"].replace("_"," ")+"\n";
		str += "Стекла: "+CV["glass_color"].replace("_"," ")+"\n";
		str += "Ручки: "+CV["handles_type"]+"\n";
		str += "Петли: "+CV["hinges_type"].replace("_"," ")+"\n";
		str += "Столешница: "+CV["worktop_type"].replace("_"," ")+" "+CV["worktop_color"].replace("_"," ")+"\n";
		str += "Мойка: "+CV["washing_type"]+"\n";
		str += "Фартук: "+CV["apron_type"]+" "+CV["apron_color"].replace("_"," ")+"\n";
		str += "Шкафчик: "+($('#above_refreg').prop('checked') ? "Да" : "Нет")+"\n";
		str += "Доставка: "+($('#delivery').prop('checked') ? "Да" : "Нет")+"\n";
		str += "Установка: "+($('#install' ).prop('checked') ? "Да" : "Нет")+"\n";
		str += "Общий итог: "+$("#TP_span").html()+"\n";
		return str;
	}

	// форма отправки заказа
	$('#order_form').dialog({ width: "21em", modal: true, show: "explode", hide: "explode", autoOpen: false,
		close: function(){ 
			$('#order_form').html(order_form_html);
			$('.ui-dialog-buttonpane .ui-button').removeAttr("disabled");
		},
		buttons:{
			"Отправить": function(){
				let ok = true, col;
				// проверка заполненности послей
				$("#order_form input[type=text], #order_form input[type=tel], #order_form input[type=email]").each(function(){
					if(this.value === this.placeholder || this.value === ""){
						col = "#f00";
						ok = false;
					}else col = "#0f0";
					$(this).css("border-color", col);
				});
				// кидаем асинхронник если все заполнено
				if(ok){
					$('.ui-dialog-buttonpane .ui-button').attr("disabled", "disabled");
					$('#order_status').html("<h1>Ожидайте...</h1>");
					$('#order_status h1').css("color", "#0f0");
					// http://mg-expert/
					$.post( "send_order.php", $('#order_form form').serialize()+"&kitchen_desc="+get_kitchen_desc(),
						function(data){
							if(data.search("debug") !== -1) alert(data); // это на время разработки
							else{
								// уведомляем пользователя о результате операции отправки заказа
								let res = "<div id='responce'>", col;
								if( parseInt(data) ){
									res += "<h1>Спасибо</h1> Заявка с Вашим заказом отправлена.<br>";
									res += "Наши специалисты свяжутся с Вами в кротчайшие сроки.";
									col = "#0f0";
								}else{
									res += "<h1>Ошибка</h1> Ваша заявка не отправлена.<br>";
									res += "Повторите попытку либо свяжитесь с нашими менеджерами по телефону.";
									col = "#f00";
								}
								res += "</div>";
								$('#order_form').html(res);
								$('#responce h1').css("color", col);
							}
						}
					);
				// ну тут всё ясно
				}else{
					$('#order_status').html("<h1>Заполните все поля!</h1>");
					$('#order_status h1').css("color", "#f00");
					$('.ui-dialog-buttonpane .ui-button').removeAttr("disabled");
				}
			}
		}
	});
	$('#issue_order_button').on("click", function(){
		order_form_html = $('#order_form').html();
		$('#order_form').dialog("open");
	});

	// печать
	$('#issue_order_print').on("click", function(){
		$('#kitchen_info_for_print').html(get_kitchen_desc().replace(/\n/g, "<br>"));
		window.print();
	});

	// настройка вида калькулятора при загрузке
	$('.type_select_panel h3').html("Фасады: "+CV['facade_type'].replace("_", " "));
	$('.facade_type').css("display", "block");
	let what = CV["door_type"] !== "Прямые" ? "direct_door" : "classic_door";
	$('.facade_type > .'+what).css("display", "none");
	$('.facade_type .first_colors').css("display", "block");
	$('.facade_type .second_colors').css("display", "none");
	$('#kitchen_info_for_print').html(get_kitchen_desc().replace(/\n/g, "<br>"));
	$('.select_item input[id="'+CV['door_top']+'"]').prev().children("img").css("border-color", "#f00");
	$('.select_item input[id="'+CV['door_bot']+'"]').prev().children("img").css("border-color", "#f00");

	/*/ зумер
	$('.layers_wrap img').each(function(){
		$(this).wrap("<a href='"+this.src+"' class='zoomIt forzoom'></a>");
	});
	$('a.forzoom').jqZoomIt({
		multiplierX	: .7, 
		multiplierY	: .7,
		zoomDistance : 1
	});
	//*/

	/*/ зумер 2
	$('.layers_wrap').mouseenter(function(){
		$('#big_pic').css("display", "block");
	});
	$('.layers_wrap').mousemove(function(event){
		let p = 12;
		$('#big_pic').css("left", event.clientX+p);
		$('#big_pic').css("top", event.clientY+p);
	});
	$('.layers_wrap').mouseout(function(){
		$('#big_pic').css("display", "none");
	});
	//*/
});
// Я ПРЕДУПРЕЖДАЛ

