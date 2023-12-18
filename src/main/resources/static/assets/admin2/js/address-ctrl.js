app.controller("address-ctrl", function($scope, $http) {
	$scope.items = [];
	$scope.form = {};
	$scope.province = [];
	$scope.districts = [];
	$scope.wards = [];
	const host = "https://provinces.open-api.vn/api/";
	var callAPI = (api) => {
		return axios.get(api)
			.then((response) => {
				renderData(response.data, "province");


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
	$("#province").change(() => {
		let selectedOptionCity = $("#province option:selected");

		let selectedCode = selectedOptionCity.data("code");
		callApiDistrict(host + "p/" + selectedCode + "?depth=2");
		$scope.form.city = selectedOptionCity.text();
	});

	$("#district").change(() => {
		let selectedOptionDistrict = $("#district option:selected");
		let selectedCode = selectedOptionDistrict.data("code");
		callApiWard(host + "d/" + selectedCode + "?depth=2");
		$scope.form.district = selectedOptionDistrict.text();
	});

	$("#ward").change(() => {
		let selectedOptionWard = $("#ward option:selected");
		$scope.form.ward = selectedOptionWard.text();
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
		var item = angular.copy($scope.form);
		item.city = ($("#province option:selected").text());
		item.district = ($("#district option:selected").text());
		item.ward = ($("#ward option:selected").text());
		let streetInput = $('#address');
		item.street = streetInput.val();
		item.addressDetail = (streetInput.val() + "," + $("#ward option:selected").text() + "," + $("#district option:selected").text() + "," + $("#province option:selected").text());

		// Check if the necessary address information is present
		if (item.city && item.district && item.ward) {
			// Check if there is an existing item with the same ID
			var existingItemIndex = $scope.items.findIndex(existingItem => existingItem.id === item.id);

			if (existingItemIndex !== -1) {
				
				$http.put(`/rest/address/${item.id}`, item).then(resp => {
					
					if ($("#province option:selected").val() === "") {
						alert("Vui lòng chọn tỉnh trước khi cập nhật.");
						return; // Dừng hàm nếu tỉnh chưa được chọn
					}
					if ($("#district option:selected").val() === "") {
						alert("Vui lòng chọn quận/huyện trước khi cập nhật.");
						return; // Dừng hàm nếu tỉnh chưa được chọn
					} if ($("#ward option:selected").val() === "") {
						alert("Vui lòng chọn phường/xã trước khi cập nhật.");
						return; // Dừng hàm nếu tỉnh chưa được chọn
					} if (!$scope.form.street) {
						alert("Vui lòng nhập tên đường trước khi cập nhật");
						return;
					}
					// Update the item in the items array
					$scope.items[existingItemIndex] = resp.data;

					// Thêm code gọi API cập nhật addressdetails
					var addressDetailsData = {
						addressId: item.id,
						// Add other fields if needed
					};

					$http.post(`/rest/addressdetails`, addressDetailsData).then(resp => {
						// Cập nhật addressdetails thành công
					}).catch(error => {
						console.log("Error updating addressdetails", error);
					});

					alert("Cập nhật thành công!");
				}).catch(error => {
					alert("Cập nhật địa chỉ không thành công");
					console.log("Error", error);
				});
			} else {
				// If ID is not found, add a new item
				$http.post(`/rest/address`, item).then(resp => {

					if ($("#province option:selected").val() === "") {
						alert("Vui lòng chọn tỉnh trước khi tạo.");
						return; // Dừng hàm nếu tỉnh chưa được chọn
					}
					if ($("#district option:selected").val() === "") {
						alert("Vui lòng chọn quận/huyện trước khi tạo.");
						return; // Dừng hàm nếu tỉnh chưa được chọn
					} if ($("#ward option:selected").val() === "") {
						alert("Vui lòng chọn phường/xã trước khi tạo.");
						return; // Dừng hàm nếu tỉnh chưa được chọn
					}
					if (!$scope.form.street) {
						alert("Vui lòng nhập tên đường trước khi tạo");
						return;
					}

					$scope.items.push(resp.data);

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
			}
		}
	};

	$scope.edit = function(item) {
		// Copy the properties of the selected item to $scope.form
		$scope.form = angular.copy(item);
		/*	 $scope.form.city = item.city;
			$scope.form.district = item.district;
			$scope.form.ward = item.ward;*/
		console.log(item)
		$("#province").val(item.city);
		$("#province").change();

		setTimeout(function() {
			$("#district").val(item.district);

			$("#district").change();

			setTimeout(function() {

				$("#ward").val(item.ward);
				$("#ward").change();
			}, 200);
		}, 200);
	}




	$scope.loadCurrentUser = function() {
		$http.get("/rest/accounts/current-account").then(resp => {
			$scope.account = resp.data;
		});
	};

	/*$scope.update = function() {
		var item = angular.copy($scope.form);
		console.log(item);


		// Log giá trị ward trước khi update

		$http.put(`/rest/address/${item.id}`, item).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items[index] = item;

			// Log giá trị ward sau khi update
			console.log("Ward value after update:", resp.data.ward);

			console.log("Update successful!", resp.data);
			alert("Cập nhật thành công!");
		}).catch(error => {
			console.log("Update error:", error);
			alert("Lỗi cập nhật !");
		});
	}*/







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
			province: null,
			available: true

		}
	}
	$scope.initialize();

})

