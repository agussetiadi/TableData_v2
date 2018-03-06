<?php
$requestData 	= $_POST;
		$arr = array("pos_order.is_deleted" => 0,'order_status !=' => 'Temp');

		if ($requestData['paid_off'] == "L") {
			$arr['paid_off'] = 1;
		}
		elseif ($requestData['paid_off'] == "BL") {
			$arr['paid_off'] = 0;
		}

		if ($requestData['order_status'] == 'Done') {
			$arr['order_status'] = "Done";
		}
		elseif ($requestData['order_status'] == 'Pending') {
			$arr['order_status'] = "Pending";	
		}

		if (!empty($requestData['date_deliver'])) {
			$arr['date_deliver >='] = $requestData['date_deliver'];
		}
		if (!empty($requestData['date_deliver2'])) {
			$arr['date_deliver <='] = $requestData['date_deliver2'];
		}


		
		
		if( !empty($requestData['search']) ) {

		    // if there is a search parameter

		    $this->db->join("pos_customer", "pos_customer.customer_id = pos_order.customer_id", "LEFT");
		    $this->db->order_by($requestData['field'],$requestData['sort']);
		    $this->db->limit($requestData['length'],$requestData['start']);
		    $this->db->like("customer_name",$requestData['search']);
		    //$this->db->or_like("no_trx",$requestData['search']);
		    $d = $this->db->get_where("pos_order", $arr);
		    $query = $d->result_array();


		    $this->db->join("pos_customer", "pos_customer.customer_id = pos_order.customer_id", "LEFT");
		    $this->db->like("customer_name",$requestData['search']);
		    //$this->db->or_like("no_trx",$requestData['search']);
		   	$totalFiltered = $this->db->get_where("pos_order", $arr)->num_rows();
		    
		} 
		else{
			$this->db->join("pos_customer", "pos_customer.customer_id = pos_order.customer_id", "LEFT");
			$this->db->order_by($requestData['field'],$requestData['sort']);
			$this->db->limit($requestData['length'],$requestData['start']);

			$ex =  $this->db->get_where("pos_order", $arr);
			$query = $ex->result_array();

			$this->db->join("pos_customer", "pos_customer.customer_id = pos_order.customer_id", "LEFT");
			$totalFiltered = $this->db->get_where("pos_order", $arr)->num_rows();	
		}



		$data = [];
		foreach ($query as $key => $value) {
			$nested = [];

			if ($value['paid_off'] == 1) {
				$stb = "Lunas";
			}
			else{
				$stb = "Belum Lunas";
			}

			$btn = '<a href="'.admin_url()."pos/order/".$value['order_id'].'"><button class="btn btn-sm btn-info"><span class="fa fa-pencil"></span></button></a> ';
			$btn .= '<a target="_blank" href="'.admin_url()."pos/print_order/".$value['order_id'].'"><button class="btn btn-sm btn-primary"><span class="fa fa-print"></span></button></a> ';
			$btn .= '<a class="btnDeleteOrder" href="'.admin_url()."pos/delete_order/".$value['order_id'].'"><button class="btn btn-sm btn-danger"><span class="fa fa-trash"></button></a>';

			$nested[] = $value['no_trx'];
			$nested[] = $value['customer_name']." - ".$value['customer_phone']."<br>".$value['address'];
			$nested[] = $this->class_date->arr_bulan($value['date_deliver'])."<br> Jam ".substr($value['time_deliver'], 0,5);
			$nested[] = $value['grand_total'];
			$nested[] = $stb;
			$nested[] = $value['order_status'];
			$nested[] = $btn;
			

			$data[] = $nested;
		}

		$json = array('data' => $data,'total' => $totalFiltered);
		return json_encode($json);