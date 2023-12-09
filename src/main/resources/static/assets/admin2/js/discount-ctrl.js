app.controller("discount-ctrl", function($scope, $http) {
	$scope.items = [];
	$scope.form = {};

	$scope.initialize = function() {
		$http.get("/rest/discountCode").then(resp => {
			$scope.categories = resp.data;
		})
		$http.get("/rest/discountCode").then(resp => {
			$scope.discountSale = resp.data;
		})

		$http.get("/rest/discountCode").then(resp => {
			$scope.items = resp.data;
		});
		$scope.reset(); //để có hình mây lyc1 mới đầu
		$scope.loadCurrentUser();
	}
	$scope.loadCurrentUser = function() {
		$http.get("/rest/accounts/current-account").then(resp => {
			$scope.account = resp.data;
		});
	};


	function validateForm() {
		if (!$scope.form.code) {
			alert("Vui lòng nhập Code!");
			return false;
		}

		// Kiểm tra discountAmount
		if (!$scope.form.discountAmount) {
			alert("Vui lòng nhập Discount Amount!");
			return false;
		}

		// Kiểm tra xem discountAmount có phải là số không
		if (!/^\d+$/.test($scope.form.discountAmount)) {
			alert("Discount Amount phải là số!");
			return false;
		}

		// Chuyển đổi discountAmount thành số và kiểm tra nó
		const discountAmount = parseInt($scope.form.discountAmount, 10);
		if (isNaN(discountAmount) || discountAmount < 0 || discountAmount > 100) {
			alert("Vui lòng nhập Discount Amount trong khoảng từ 0 đến 100!");
			return false;
		}

		// Kiểm tra quantity
		if (!$scope.form.quantity) {
			alert("Vui lòng nhập Discount Quantity!");
			return false;
		}

		// Kiểm tra xem quantity có phải là số không
		if (!/^\d+$/.test($scope.form.quantity)) {
			alert("Discount Quantity phải là số!");
			return false;
		}

		// Chuyển đổi quantity thành số và kiểm tra nó
		const quantity = parseInt($scope.form.quantity, 10);
		if (isNaN(quantity) || quantity < 0) {
			alert("Vui lòng nhập Discount Quantity hợp lệ!");
			return false;
		}

		// Kiểm tra trạng thái Active
		if (typeof $scope.form.activate !== 'boolean') {
			alert("Vui lòng chọn trạng thái Active!");
			return false;
		}

		// Kiểm tra ngày bắt đầu và kết thúc
		if (!$scope.form.start_Date || !$scope.form.end_Date) {
			alert("Vui lòng chọn Ngày bắt đầu và Ngày kết thúc!");
			return false;
		}

		if ($scope.form.start_Date > $scope.form.end_Date) {
			alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc!");
			return false;
		}

		// Thêm các điều kiện kiểm tra khác nếu cần

		return true;
	}

	$scope.create = function() {
		var item = angular.copy($scope.form);

		if (!validateForm()) {
			return; // Ngừng hàm và không tiến hành tạo mới
		}

		$http.post(`/rest/discountCode`, item).then(resp => {
			$scope.items.push(resp.data);
			$scope.reset();
			alert("Thêm mới mã giảm giá thành công!");
		}).catch(error => {
			alert("Lỗi thêm mới mã giảm giá!");
			console.log("Error", error);
		});
	}


	$scope.edit = function(item) {
		$scope.form = angular.copy(item);
		$scope.form.start_Date = new Date(item.start_Date);
		$scope.form.end_Date = new Date(item.end_Date);
		$(".nav-tabs a:eq(0)").tab("show");
	}

	$scope.reset = function() {
		$scope.form = {
			available: true,
		}
	}

	$scope.update = function() {
		
		if (!validateForm()) {
			return; // Ngừng hàm và không tiến hành tạo mới
		}
		
		var item = angular.copy($scope.form);
		if (item.start_Date > item.end_Date) {
			alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc!");
			return; // Ngừng hàm và không tiến hành tạo mới
		}

		$http.put(`/rest/discountCode/${item.id}`, item).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items[index] = item;
			alert("Cập nhật lịch sử đơn hàng thành công!");
		})
			.catch(error => {
				alert("Lỗi cập nhật lịch sử đơn hàng!");
				console.log("Error", error);
			});
	}

	$scope.delete = function(item) {
		if (confirm("Bạn muốn xóa lịch sử đơn hàng này?")) {
			$http.delete(`/rest/discountCode/${item.id}`).then(resp => {
				var index = $scope.items.findIndex(p => p.id == item.id);
				$scope.items.splice(index, 1);
				$scope.reset();
				alert("Xóa lịch sử đơn hàng thành công!");
			}).catch(error => {
				alert("Lỗi xóa lịch sử đơn hàng!");
				console.log("Error", error);
			})
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
	$scope.initialize();
});