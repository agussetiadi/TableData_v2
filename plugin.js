(function($){
	var color = "red";


	$.fn.tableData = function(objParam){

		var setting = $.extend({
			url : 'server.php',
			length : 'unset',
			search : 'unset',
			field : 'unset',
			data : 'unset',
			dataFilter : 'unset',
			defaultSort : 'unset'
		},objParam);


		var url = setting.url;
		var init = $(this);
		var select = $(this)[0].attributes[0].value
		var footer = select+'-footer';
		var pageName = select+'-page';
		var countTotal = select+'-countTotal';
		var wrapper = 'wrapper-'+select;
		var btnNext = select+'-btnNext';
		var btnPre = select+'-btnPre';

		var selectorEl = $(this).selector;

		$(this).find('thead').addClass(select + '-thead');
		var headerSelector = select + '-thead';
		var headerTh = selectorEl + " th";

		this.reload = function(objSend){
			$("#"+pageName).val(1);
			page = 1;

			if (setting.length !== 'unset') {
				length = $(setting.length).val();
			}
			else{
				length = 3;
			}
			if (setting.search !== 'unset') {
				search = $(setting.search).val()
			}
			else{
				search = '';
			}
			start = page * length - length;

			var sortInit = getSortThead(headerTh,defaultField);/*Proses mengambil sorting dr thead*/
			var paramObj = {
				length : length,
				start : start,
				search : search,
				field : sortInit.field,
				sort : sortInit.sort
			}
			
			if (typeof objSend !== 'undefined') {
				var dataSend = objSend;
					Object.keys(dataSend).forEach(function(key){
						paramObj[key]  = dataSend[key]
					})
			}
			if (setting.dataFilter !== 'unset') {
				var dataSend2 = setting.dataFilter;
				Object.keys(dataSend2).forEach(function(key2){
					paramObj[key2]  = $(dataSend2[key2]).val()
				})
			}
			else{
				if (setting.data !== 'unset') {
					var dataSend = setting.data;
					Object.keys(dataSend).forEach(function(key){
						paramObj[key]  = dataSend[key]
					})
				}
			}


			ajax({
				url : url ,
				selector : init,
				footer : footer,
				data : paramObj,
				countTotal : countTotal
			});
		}

		return this.each(function(i){
			/*
			Membuat Selector Baru
			tambahkan index i untuk menghidari conflict
			*/
			


			

			if (setting.field !== 'unset') {
				defaultField = setting.field;
			}
			else{
				defaultField = [1];
			}

			var footerHtml = '<div style="margin-top:10px; width:100% ">';
			footerHtml += '<div class="'+footer+'" style="display : inline; margin-right : 20px;"><button id="'+btnPre+'" class="btn btn-primary btn-sm">';
			footerHtml += 'Previous </button> <input type="text" style="width : 40px; border-style:solid" id="'+pageName+'"  value="1">';
			footerHtml += '<button id="'+btnNext+'" class="btn btn-primary btn-sm"> Next </button></div>';
			footerHtml += '<div class="'+countTotal+'" style="display : inline;"><i>Total Data</i></div></div>';

			var wrapperHtml	= '<div class="'+wrapper+'" style="position:relative"></div>';


			if ($(footer).length == 0) {
				$(this).after(wrapperHtml);
				$("."+wrapper).html($(this));
				$("."+wrapper).append(footerHtml);

				var page = 1;
			}


			if (setting.length !== 'unset') {
				length = $(setting.length).val();
			}
			else{
				length = 10;
			}
			if (setting.search !== 'unset') {
				search = $(setting.search).val()
			}
			else{
				search = '';
			}




			var start = page * length - length;

			/*Ketika pertama kali di load
				mencari default sort
				bertipe array
					array[0] = nama field / order by
					array[1] = sorting data, asc / desc
			*/
			if (setting.defaultSort !== 'unset') {
				var sortInit = {
					field : setting.defaultSort[0], /* -> order by*/
					sort : setting.defaultSort[1], /* -> desc or asc */
				}
			}
			else{
				var sortInit = getSortThead(headerTh,defaultField);
			}

			
			var paramObj = {
				length : length,
				start : start,
				search : search,
				field : sortInit.field,
				sort : sortInit.sort
			}

			

			if (setting.data !== 'unset') {
				var dataSend = setting.data;
				Object.keys(dataSend).forEach(function(key){
					paramObj[key]  = dataSend[key]
				})
			}

			if (setting.dataFilter !== 'unset') {
				var dataSend2 = setting.dataFilter;
				Object.keys(dataSend2).forEach(function(key2){
					paramObj[key2]  = $(dataSend2[key2]).val()
				})
			}


			ajax({
				url : url ,
				selector : init,
				footer : footer,
				data : paramObj,
				countTotal : countTotal
			});

			$(document).on('change', "#" + pageName, function(){
				var oldNumber = $(this).val();

				page = $(this).val();
				page = parseInt(page);

				if (page > 0) {
					$(this).val(page)
					if (setting.length !== 'unset') {
						length = $(setting.length).val();
					}
					else{
						length = 3;
					}
					if (setting.search !== 'unset') {
						search = $(setting.search).val()
					}
					else{
						search = '';
					}
					start = page * length - length;

					var sortInit = getSortThead(headerTh,defaultField);
					var paramObj = {
						length : length,
						start : start,
						search : search,
						field : sortInit.field,
						sort : sortInit.sort
					}
					if (setting.data !== 'unset') {
						var dataSend = setting.data;
						Object.keys(dataSend).forEach(function(key){
							paramObj[key]  = dataSend[key]
						})
					}
					if (setting.dataFilter !== 'unset') {
						var dataSend2 = setting.dataFilter;
						Object.keys(dataSend2).forEach(function(key2){
							paramObj[key2]  = $(dataSend2[key2]).val()
						})
					}
					ajax({
						url : url ,
						selector : init,
						footer : footer,
						data : paramObj,
						countTotal : countTotal
					});
				}
				else{
					$(this).val(1);
				}
			})

				$(document).on("click", "#"+btnNext, function(){
					var valPageOld = $("#"+pageName).val();
					var valPageNew = parseInt(valPageOld) + 1;
						$("#"+pageName).val(valPageNew);

					page = valPageNew;

					if (setting.length !== 'unset') {
						length = $(setting.length).val();
					}
					else{
						length = 3;
					}
					if (setting.search !== 'unset') {
						search = $(setting.search).val()
					}
					else{
						search = '';
					}
					start = page * length - length;

					var sortInit = getSortThead(headerTh,defaultField);
					var paramObj = {
						length : length,
						start : start,
						search : search,
						field : sortInit.field,
						sort : sortInit.sort
					}
					if (setting.data !== 'unset') {
						var dataSend = setting.data;
						Object.keys(dataSend).forEach(function(key){
							paramObj[key]  = dataSend[key]
						})
					}
					if (setting.dataFilter !== 'unset') {
						var dataSend2 = setting.dataFilter;
						Object.keys(dataSend2).forEach(function(key2){
							paramObj[key2]  = $(dataSend2[key2]).val()
						})
					}
					ajax({
						url : url ,
						selector : init,
						footer : footer,
						data : paramObj,
						countTotal : countTotal
					});
				})

				$(document).on("click", "#"+btnPre, function(){
					var valPageOld = $("#"+pageName).val();

					var valPageNew = parseInt(valPageOld) - 1;
						$("#"+pageName).val(valPageNew);

					if (valPageOld <= 1) {
						$("#"+pageName).val(1);
					}
					else{

						page = valPageNew;

						if (setting.length !== 'unset') {
							length = $(setting.length).val();
						}
						else{
							length = 3;
						}
						if (setting.search !== 'unset') {
							search = $(setting.search).val()
						}
						else{
							search = '';
						}
						start = page * length - length;

						var sortInit = getSortThead(headerTh,defaultField);
						var paramObj = {
							length : length,
							start : start,
							search : search,
							field : sortInit.field,
							sort : sortInit.sort
						}
						if (setting.data !== 'unset') {
							var dataSend = setting.data;
							Object.keys(dataSend).forEach(function(key){
								paramObj[key]  = dataSend[key]
							})
						}
						if (setting.dataFilter !== 'unset') {
							var dataSend2 = setting.dataFilter;
							Object.keys(dataSend2).forEach(function(key2){
								paramObj[key2]  = $(dataSend2[key2]).val()
							})
						}
						ajax({
							url : url ,
							selector : init,
							footer : footer,
							data : paramObj,
							countTotal : countTotal
						});
						
					}
				})


			if (setting.length !== 'unset') {

				$(document).on('change', setting.length, function(){
					page = $("#"+pageName).val();

					if (setting.length !== 'unset') {
						length = $(setting.length).val();
					}
					else{
						length = 3;
					}
					if (setting.search !== 'unset') {
						search = $(setting.search).val()
					}
					else{
						search = '';
					}
					start = page * length - length;

					var sortInit = getSortThead(headerTh,defaultField);/*Proses mengambil sorting dr thead*/
					var paramObj = {
						length : length,
						start : start,
						search : search,
						field : sortInit.field,
						sort : sortInit.sort
					}
					
					if (setting.data !== 'unset') {
						var dataSend = setting.data;
						Object.keys(dataSend).forEach(function(key){
							paramObj[key]  = dataSend[key]
						})
					}
					if (typeof objSend !== 'undefined') {

						var dataSend2 = setting.dataFilter;
							Object.keys(dataSend2).forEach(function(key2){
								paramObj[key2]  = $(dataSend2[key2]).val()
							})
					}
					else{
						if (setting.dataFilter !== 'unset') {
							
							var dataSend2 = setting.dataFilter;
							Object.keys(dataSend2).forEach(function(key2){
								paramObj[key2]  = $(dataSend2[key2]).val()
							})
						}
					}


					ajax({
						url : url ,
						selector : init,
						footer : footer,
						data : paramObj,
						countTotal : countTotal
					});
				})

			}
			
			if (setting.search !== 'unset') {

				$(document).on('input', setting.search, function(){

					$("#"+pageName).val(1);
					page = 1;

					if (setting.length !== 'unset') {
						length = $(setting.length).val();
					}
					else{
						length = 3;
					}
					if (setting.search !== 'unset') {
						search = $(setting.search).val()
					}
					else{
						search = '';
					}
					start = page * length - length;


					var sortInit = getSortThead(headerTh,defaultField);/*Proses mengambil sorting dr thead*/
					var paramObj = {
						length : length,
						start : start,
						search : search,
						field : sortInit.field,
						sort : sortInit.sort
					}
					
					if (setting.data !== 'unset') {
						var dataSend = setting.data;
						Object.keys(dataSend).forEach(function(key){
							paramObj[key]  = dataSend[key]
						})
					}
						
					if (typeof objSend !== 'undefined') {

						var dataSend2 = setting.dataFilter;
							Object.keys(dataSend2).forEach(function(key2){
								paramObj[key2]  = $(dataSend2[key2]).val()
							})
					}
					else{
						if (setting.dataFilter !== 'unset') {
							
							var dataSend2 = setting.dataFilter;
							Object.keys(dataSend2).forEach(function(key2){
								paramObj[key2]  = $(dataSend2[key2]).val()
							})
						}
					}


					ajax({
						url : url ,
						selector : init,
						footer : footer,
						data : paramObj,
						countTotal : countTotal
					});
					
				})

			}

			
			$(document).on('click', headerTh, function(){

				var inx = $(headerTh).index(this);
				$(headerTh).removeClass('sortingDesc');
				$(headerTh).removeClass('sortingAsc');

				if ($(headerTh).eq(inx).attr("sort") == "desc") {
					$(headerTh).eq(inx).attr("sort","asc");
					$(headerTh).eq(inx).addClass("sortingAsc");
				}
				else if($(headerTh).eq(inx).attr("sort") == "asc"){
					$(headerTh).eq(inx).attr("sort","desc");
					$(headerTh).eq(inx).addClass("sortingDesc");
					
				}
				else{
					$(headerTh).removeAttr("sort");
					$(headerTh).eq(inx).attr("sort","desc");
					$(headerTh).eq(inx).addClass("sortingDesc");
				}


				$("#"+pageName).val(1);
				page = 1;

					if (setting.length !== 'unset') {
						length = $(setting.length).val();
					}
					else{
						length = 3;
					}
					if (setting.search !== 'unset') {
						search = $(setting.search).val()
					}
					else{
						search = '';
					}
					start = page * length - length;


					var sortInit = getSortThead(headerTh,defaultField);/*Proses mengambil sorting dr thead*/

					var paramObj = {
						length : length,
						start : start,
						search : search,
						field : sortInit.field,
						sort : sortInit.sort
					}
					if (setting.data !== 'unset') {
						var dataSend = setting.data;
						Object.keys(dataSend).forEach(function(key){
							paramObj[key]  = dataSend[key]
						})
					}

					if (setting.dataFilter !== 'unset') {
						var dataSend2 = setting.dataFilter;
							Object.keys(dataSend2).forEach(function(key2){
								paramObj[key2]  = $(dataSend2[key2]).val()
							})
					}
					ajax({
						url : url ,
						selector : init,
						footer : footer,
						data : paramObj,
						countTotal : countTotal
					});
			})



		})
		
	}


	/*Default data to Send

		{length : param.length, 
		start : param.start, 
		field : param.field, 
		sort : param.sort, 
		search : param.search}

	*/


	function lookData(url,param,callback){
		$.ajax({
			url : url,
			method : 'POST',
			data : param,
			success : function(jsonData){
				var obj = JSON.parse(jsonData);
				if (callback)
					callback(obj);
			}
		})
	}

	function getSortThead(selectThead,defaultField){

		var selector = $(selectThead);
		var arrayPush = []; /*identifikasi apakah ada hasil atau tidak*/


		for (var x = 0; x < selector.length; x++) {

			if (typeof selector.eq(x).attr('sort') !== 'undefined') {
				
				arrayPush.push(x);
				var result = selector.eq(x).attr('sort');

				if (typeof defaultField[x] !== 'undefined') {

					var objResult = {
						sort : result,
						field : defaultField[x]
					}
				}
				else{
					var objResult = {
						sort : result,
						field : 1
					}	
				}

			}
		}

		/*Kembalikan hasil default jika dalam array tidak ada value*/

		if (arrayPush.length == 0) {
			var objResult = {
					sort : 'asc',
					field : 1
				}
		}
			return objResult;

	}

	function ajax(parameterObject, callback){

		var url = parameterObject.url;
		var selector = parameterObject.selector;
		var setting = parameterObject.data;
		var footer = parameterObject.footer;
		var countTotal = parameterObject.countTotal;

		lookData(url,setting, function(dataObj){

			var data = dataObj.data;
	        var num = data.length;
	        var totalData = dataObj.total;
	        
	        var tr = "";

	        for (var i = 0; i < num; i++) {

	          var frontTr = '<tr>';
	          var backTr = '</tr>';

	          var nested = data[i];
	          var numNested = nested.length;
	          var td = "";
	            for (var b = 0; b < numNested; b++) {
	              td += '<td>'+nested[b]+'</td>';
	            }
	          tr += frontTr+td+backTr;
	        }

	        selector.find('tbody').html(tr);

	        

	        if (totalData <= setting.length) {
	        	$("."+footer).hide();
	        }
	        else{
	        	$("."+footer).show();	
	        }

	        $("."+countTotal).find('i').html('Total Data '+totalData);

			if (callback)
				callback(totalData)



		});
	}

})(jQuery);