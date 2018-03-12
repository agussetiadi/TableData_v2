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
			defaultSort : 'unset',
			dataSelect : {
				init : 'unset',
				select : 'unset'
			}
		},objParam);

		/*
		* secara default saat plugin pertama diload dia akan memeriksa
		  apakah ada paramater defaultSort atau tidak
		  
		* parameter defaultSort ini di set oleh user

		* parameter defaultSort : fungsinya untuk menentukan sorting default 
		  saat plugin pertama kali di load,
		* valuenya harus berupa array(),
		  array pertama sebagai nama fieldnya dan array kedua sebagaia jenis sortingnya
		  apakah sorting "asc" / "desc", Ex -> defaultSort : ['nama_field','desc']
		*/

		var url = setting.url;
		var init = $(this);
		var select = $(this)[0].id;
		var footer = select+'-footer';
		var pageName = select+'-page';
		var countTotal = select+'-countTotal';
		var wrapper = 'wrapper-'+select;
		var btnNext = select+'-btnNext';
		var btnPre = select+'-btnPre';
		var selectorEl = "#"+select;


		$(this).find('thead').addClass(select + '-thead');
		var headerSelector = select + '-thead';
		var headerTh = selectorEl + " th";
		$(headerTh).css('cursor','pointer');


		this.reload = function(objSend){
			$("#"+pageName).val(1)
			page = 1;

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
			start = page * length - length;

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

			var perPage = length;
			var currentPage = page;
			ajax({
				url : url ,
				selector : init,
				footer : footer,
				data : paramObj,
				countTotal : countTotal,
				pageName : pageName,
				perPage : perPage,
				currentPage : currentPage
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
			footerHtml += '<div class="'+footer+'" style="display : inline; margin-right : 20px;"><button style="" id="'+btnPre+'" class="btn btn-primary">';
			footerHtml += 'Previous </button> <select class="custom-select" style="margin:0;" id="'+pageName+'"><option value="1">1</option></select>';
			footerHtml += '<button style="margin-left:5px" id="'+btnNext+'" class="btn btn-primary"> Next </button></div>';
			footerHtml += '<div class="'+countTotal+'" style="display : inline;"><i>Total Data</i></div></div>';

			var wrapperHtml	= '<div class="'+wrapper+'" style="position:relative"></div>';


			if ($(footer).length == 0) {
				$(this).after(wrapperHtml);
				$("."+wrapper).html($(this));
				$("."+wrapper).append(footerHtml);
				
				$("#"+pageName).val(1)
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

			var perPage = length;
			var currentPage = page;

			ajax({
				url : url ,
				selector : init,
				footer : footer,
				data : paramObj,
				countTotal : countTotal,
				pageName : pageName,
				perPage : perPage,
				currentPage : currentPage
			});

			$(document).on('change', "#" + pageName, function(){
				var oldNumber = $(this).val();

				page = $(this).val();
				page = parseInt(page);

				if (page > 0) {
					
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
					var perPage = length;
					var currentPage = page;

					ajax({
						url : url ,
						selector : init,
						footer : footer,
						data : paramObj,
						countTotal : countTotal,
						pageName : pageName,
						perPage : perPage,
						currentPage : currentPage
					});
				}
				
			})

				$(document).on("click", "#"+btnNext, function(){
					var valPageOld = $("#"+pageName).val();
					var valPageNew = parseInt(valPageOld) + 1;
					var countValPageOrigin = $("#"+pageName+' option').length
						
					if (valPageNew <= countValPageOrigin){
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
						var perPage = length;
						var currentPage = page;

						ajax({
							url : url ,
							selector : init,
							footer : footer,
							data : paramObj,
							countTotal : countTotal,
							pageName : pageName,
							perPage : perPage,
							currentPage : currentPage
						});
						
					}

				})

				$(document).on("click", "#"+btnPre, function(){
					var valPageOld = $("#"+pageName).val();

					var valPageNew = parseInt(valPageOld) - 1;
						

					if (valPageOld <= 1) {
						/**/
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
						var perPage = length;
						var currentPage = page;

						ajax({
							url : url ,
							selector : init,
							footer : footer,
							data : paramObj,
							countTotal : countTotal,
							pageName : pageName,
							perPage : perPage,
							currentPage : currentPage
						});
						
					}
				})


			if (setting.length !== 'unset') {

				$(document).on('change', setting.length, function(){
					$("#"+pageName).val(1)
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


					var perPage = length;
					var currentPage = page;

					ajax({
						url : url ,
						selector : init,
						footer : footer,
						data : paramObj,
						countTotal : countTotal,
						pageName : pageName,
						perPage : perPage,
						currentPage : currentPage
					});
				})

			}
			
			if (setting.search !== 'unset') {

				$(document).on('input', setting.search, function(){

					$("#"+pageName).val(1)
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

					var perPage = length;
					var currentPage = page;
					ajax({
						url : url ,
						selector : init,
						footer : footer,
						data : paramObj,
						countTotal : countTotal,
						pageName : pageName,
						perPage : perPage,
						currentPage : currentPage
					});
					
				})

			}

			
			$(document).on('click', headerTh, function(){

				var inx = $(headerTh).index(this);
				$(headerTh).removeClass('sortingDesc');
				$(headerTh).removeClass('sortingAsc');
				$(headerTh).find('.th-fa').remove();
				if ($(headerTh).eq(inx).attr("sort") == "desc") {
					$(headerTh).eq(inx).attr("sort","asc");
					$(headerTh).eq(inx).addClass("sortingAsc");
					$(headerTh).eq(inx).append('<span style="margin-left:10px;" class="th-fa fa fa-sort-amount-asc"></span>');
				}
				else if($(headerTh).eq(inx).attr("sort") == "asc"){
					$(headerTh).eq(inx).attr("sort","desc");
					$(headerTh).eq(inx).addClass("sortingDesc");
					$(headerTh).eq(inx).append('<span style="margin-left:10px;" class="th-fa fa fa-sort-amount-desc"></span>');
					
				}
				else{
					$(headerTh).removeAttr("sort");
					$(headerTh).eq(inx).attr("sort","desc");
					$(headerTh).eq(inx).addClass("sortingDesc");
					$(headerTh).eq(inx).append('<span style="margin-left:10px;" class="th-fa fa fa-sort-amount-desc"></span>');
				}


				$("#"+pageName).val(1)
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
					var perPage = length;
					var currentPage = page;
					ajax({
						url : url ,
						selector : init,
						footer : footer,
						data : paramObj,
						countTotal : countTotal,
						pageName : pageName,
						perPage : perPage,
						currentPage : currentPage
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


	/*
	* function getShortThead
	* untuk memberi nilai ke parameter ajax apakah sorting
	  yang di berikan berupa Descending atau Ascending

	* nilai yang di dapat di ambil dari pengambilan attribut pada html thead
	  value nya dapat berupa ascending/descending -> sort="desc" / sort="asc"


	*/

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

	/*
	* Function For render html page in footer
	* totalRow : totalData yang di ambil dari server
	* perPage : totalValue perpage pada properti
	* currentPage : value halaman yang akan di selected
	  value berdasarkan nomor halaman yang akan di selected
	*/

	function pagingSelect(pageName,totalRow, perPage, currentPage){
		if (typeof currentPage == 'undefined') {
			currentPage = 1;
		}


		var selectedPaging = "#"+pageName;
		var totalPaging = Math.ceil(parseInt(totalRow) / parseInt(perPage));
		var valPageOrigin = parseInt($(selectedPaging).val());
		if (currentPage > totalPaging) {
			currentPage = valPageOrigin;
		}
		if (currentPage < 1) {
			currentPage = 1;
		}

		var opttHtm = '<option value="1">1</option>';
		for (var i = 2; i <= totalPaging; i++) {
			opttHtm += '<option value="'+i+'">'+i+'</option>';
		}
		$(selectedPaging).html(opttHtm);
		$(selectedPaging).find('option[value='+currentPage+']')
		$(selectedPaging).val(currentPage);
	}


	/*
	* Functon Ajax
	* untuk mengeksekusi perintah yang diberikan sesuai dengan parameter
	  parameter yang diberikan dieksekusi di setiap even saat mengambil data
	* 
	*/
	function ajax(parameterObject, callback){

		var url 		= parameterObject.url;
		var selector 	= parameterObject.selector;
		var setting 	= parameterObject.data;
		var footer 		= parameterObject.footer;
		var countTotal 	= parameterObject.countTotal;
		var pageName 	= parameterObject.pageName;
		var perPage 	= parameterObject.perPage;
		var currentPage = parameterObject.currentPage;

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
	        pagingSelect(pageName,totalData, perPage, currentPage)


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