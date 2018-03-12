<!DOCTYPE html>
<html>
<head>
	<title> Is Maintenance</title>
	<style type="text/css">
		.sortingDesc{
			background: url('desc.png');
			background-repeat: no-repeat;
			background-position: right;
		}
		.sortingAsc{
			background: url('asc.png');
			background-repeat: no-repeat;
			background-position: right;
		}
	</style>

	<script type="text/javascript" src="jquery.js"></script>
	<script type="text/javascript" src="plugin.js"></script>
</head>
<select id="length">
	<option>2</option>
	<option>4</option>
	<option>6</option>
</select>
<input type="text" name="" id="search">

<select class="form-control custom-select" id="order_status" style="margin: 0">
	<option value="all">Status</option>
	<option value="Pending">Pending</option>
	<option value="Done">Done</option>
</select>
<select class="form-control custom-select" id="paid_off" style="margin: 0">
	<option value="all">Pembayaran</option>
	<option value="L">Lunas</option>
	<option value="BL">Belum Lunas</option>
</select>
<table id="lookUp" style="width: 50%;" border="1">
	<thead>
		<th>No</th>
		<th>Customer</th>
		<th>Daliver</th>
		<th>Total</th>
		<th>Status</th>
		<th>TRX</th>
		<th>Action</th>
		
	</thead>
	<tbody></tbody>
</table>

<body>
<script type="text/javascript">

	$(document).ready(function(){
		var order_status = $("#order_status").val();
		var paid_off = $("#paid_off").val();
		

		/*
		- url(Required) 	= url ke server tujuan
		- search(optional) 	= input type text untuk live search
								tambahkan input html sesuai keinginan dan pastikan nama class
								atau ID yang digunakan untuk pemanggilan sesuai dengan parameter
								(option : kosongkan jika tidak menggunakan live search)
		- length(optional) 	= input type select option, untuk membuat limit data
								tambahkan input select html sesuai keinginan dan pastikan nama class
								atau ID yang digunakan untuk pemanggilan sesuai dengan parameter
								(option : kosongkan jika tidak menggunakan live search
										  jumlah row secara default akan dilimit 10 row
								)
		- field(optional) 	= data field yang akan di ambil dari table
								(option : kosongkan jika tidak digunakan
										  secara default akan mengurutkan secara descending
										  mengambil dari field pertama dari table database
										  )
		- dataFilter(optional) 	= data yang ingin dikirim selain parameter diatas, 
							  	  Format harus Berbentuk Selector

		- data = data tambahan untuk di kirim ke server, berbentuk object

		- Reload = gunakan fungsi reload dan pastikan parameter di definisikan lagi
					agar data terkirim secara live
		- defaultSort = default sorting table ketika pertama kali di load
						array[0] = nama field,
						array[1] = jenis sort, asc / desc
		*/
		var kamplehTable = $('#lookUp').tableData({
			url : 'http://localhost:8080/gonam/admin/pos/render_order',
			search : '#search',
			length : '#length',
			field : ['order_id', 'customer_name','date_deliver'],
			defaultSort : ['order_id','desc'],
			dataFilter : {
				order_status : "#order_status",
				paid_off : "#paid_off"
			},
			data : {
				      param1 : '1',
				      param2 : '2'
				     
				    }
		});


		$(document).on("change","#order_status", function(){
			var order_status = $("#order_status").val();
			var paid_off = $("#paid_off").val();

			kamplehTable.reload({
				order_status : "#order_status",
				paid_off : "#paid_off"
			});
		})

		$(document).on("change","#paid_off", function(){
			var order_status = $("#order_status").val();
			var paid_off = $("#paid_off").val();

			kamplehTable.reload({
				order_status : "#order_status",
				paid_off : "#paid_off"
			});
		})
	})
	

</script>


</body>
</html>