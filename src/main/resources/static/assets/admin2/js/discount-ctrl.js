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
	}
	$scope.create = function() {
		var item = angular.copy($scope.form);


		if (item.start_Date > item.end_Date) {
			alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc!");
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