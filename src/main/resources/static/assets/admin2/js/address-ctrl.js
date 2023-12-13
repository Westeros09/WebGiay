app.controller("address-ctrl", function($scope, $http) {
	$scope.items = [];
	$scope.form = {};
	$scope.city = [];
	$scope.districts = [];
	$scope.wards = [];
	const host = "https://provinces.open-api.vn/api/";
	var callAPI = (api) => {
		return axios.get(api)
			.then((response) => {
				renderData(response.data, "city");


			});
	}
	callAPI('https://provinces.open-api.vn/api/?depth=1');
	var callApiDistrict = (api) => {
		return axios.get(api)
			.then((response) => {
				renderData(response.data.districts, "district");
			});
	}
	var callApiWard = (api) => {
		return axios.get(api)
			.then((response) => {
				renderData(response.data.wards, "ward");
			});
	}

	var renderData = (array, select) => {
		let row = ' <option disable value="">chọn</option>';
		array.forEach(element => {
			row += `<option data-code="${element.code}" value="${element.name}">${element.name}</option>`
		});
		document.querySelector("#" + select).innerHTML = row;
	}
	$("#city").change(() => {
		let selectedOptionCity = $("#city option:selected");
		console.log("Province changed. Selected Option:", selectedOptionCity.text());

		let selectedCode = selectedOptionCity.data("code");
		callApiDistrict(host + "p/" + selectedCode + "?depth=2");
		$scope.city = selectedOptionCity.text();


	});

	$("#district").change(() => {
		let selectedOptionDistrict = $("#district option:selected");
		console.log("District changed. Selected Option:", selectedOptionDistrict.text());
		let selectedCode = selectedOptionDistrict.data("code");
		callApiWard(host + "d/" + selectedCode + "?depth=2");


	});

	$("#ward").change(() => {
		let selectedOptionWard = $("#ward option:selected");
		console.log("Ward changed. Selected Option:", selectedOptionWard.text());

	});




	$scope.initialize = function() {
		$http.get("/rest/address").then(resp => {
			$scope.items = resp.data;
			console.log(resp.data);
			console.log(resp.data.addressDetail);
			$scope.form = {

				available: true,


			};
		})


		$http.get("/rest/accounts").then(resp => {
			$scope.accounts = resp.data;
		});

		$scope.reset(); //để có hình mây lyc1 mới đầu
		$scope.loadCurrentUser();
	}

	$scope.create = function() {
		/*	console.log($("#province option:selected").text());
			console.log($("#district option:selected").text());
			console.log($("#ward option:selected").text());
			console.log("Form data before copy:", $scope.form);*/

		var item = angular.copy($scope.form);

		item.city = ($("#city option:selected").text());
		item.district = ($("#district option:selected").text());
		item.ward = ($("#ward option:selected").text());
		let streetInput = $('#address');
		item.street = streetInput.val();

		item.addressDetail = (streetInput.val() + "," + $("#ward option:selected").text() + "," + $("#district option:selected").text() + "," + $("#province option:selected").text());
		console.log(item.city);
		console.log(item.district);
		console.log(item.ward);

		// Check if the necessary address information is present
		if (item.city && item.district && item.ward) {


			$http.post(`/rest/address`, item).then(resp => {
				$scope.items.push(resp.data);

				$scope.reset();

				// Thêm code gọi API cập nhật addressdetails
				var newAddressId = resp.data.id;
				var addressDetailsData = {
					addressId: newAddressId,
					// Add other fields if needed
				};

				$http.post(`/rest/addressdetails`, addressDetailsData).then(resp => {
					// Cập nhật addressdetails thành công
				}).catch(error => {
					console.log("Error updating addressdetails", error);
				});

				alert("Thêm mới thành công!");
			}).catch(error => {
				alert("Thêm địa chỉ không thành công");
				console.log("Error", error);
			});
		} else {
			alert("Vui lòng chọn đầy đủ thông tin địa chỉ (province, district, ward) trước khi tạo.");
		}
	}

$scope.edit = function(item) {
    // Copy the properties of the selected item to $scope.form
    $scope.form = angular.copy(item);

    // Manually set the selected values for the dropdowns
    $scope.form.city = item.city;
    $scope.form.district = item.district;
    $scope.form.ward = item.ward;
    
    
    
    $("#province option:selected").text();
   
   
   

}


	$scope.loadCurrentUser = function() {
		$http.get("/rest/accounts/current-account").then(resp => {
			$scope.account = resp.data;
		});
	};

	$scope.update = function() {
		var item = angular.copy($scope.form);

		$http.put(`/rest/address/${item.id}`, item).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items[index] = item;
			alert("Cập nhật thành công!");
		})
			.catch(error => {
				alert("Lỗi cập nhật !");
				console.log("Error", error);
			});
	}


	$scope.delete = function(item) {
		if (confirm("Bạn muốn xóa address này?")) {
			$http.delete(`/rest/address/${item.id}`).then(resp => {
				var index = $scope.items.findIndex(p => p.id === item.id);
				$scope.items.splice(index, 1);
				$scope.reset();
				alert("Xóa địa chỉ thành công!");
			}).catch(error => {
				if (error.status === 500) {
					alert("Lỗi máy chủ, vui lòng thử lại sau.");
				} else {
					alert("Lỗi xóa !");
				}
			});
		}
	}

	$scope.pager = {
		page: 0,
		size: 4,
		get items() {
			if (this.page < 0) {
				this.last();
			}
			if (this.page >= this.count) {
				this.first();
			}
			var start = this.page * this.size;
			return $scope.items.slice(start, start + this.size)
		},
		get count() {
			return Math.ceil(1.0 * $scope.items.length / this.size);
		},
		first() {
			this.page = 0;
		},
		last() {
			this.page = this.count - 1;
		},
		next() {
			this.page++;
		},
		prev() {
			this.page--;
		}
	}
	$scope.reset = function() {
		$scope.form = {
			available: true
		}
	}
	$scope.initialize();

})

