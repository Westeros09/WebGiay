app.controller("discountProduct-ctrl", function($scope, $http) {
	$scope.items = [];
	$scope.form = {};

	$scope.initialize = function() {
		$http.get("/rest/products").then(resp => {
			$scope.products = resp.data;
		});

		$http.get("/rest/discountProduct").then(resp => {
			$scope.items = resp.data;
		});
		$scope.reset(); // đặt lại form để có hình mẫu mới đầu
	}
	



function hasOverlappingPeriod(item) {
    // Duyệt qua danh sách các sản phẩm đã có
    for (var i = 0; i < $scope.items.length; i++) {
        var existingItem = $scope.items[i];
        
        // Kiểm tra xem sản phẩm có cùng ID không
        if (existingItem.product.id === item.product.id) {
            // Chuyển đổi ngày bắt đầu và ngày kết thúc thành đối tượng Date
            var existingStartDate = new Date(existingItem.start_Date);
            var existingEndDate = new Date(existingItem.end_Date);
            var newItemStartDate = new Date(item.start_Date);
            var newItemEndDate = new Date(item.end_Date);

            // Kiểm tra xem có sự trùng lặp trong khoảng thời gian không
            if (
                (newItemStartDate < existingEndDate && newItemEndDate > existingStartDate) ||
                (existingStartDate < newItemEndDate && existingEndDate > newItemStartDate)
            ) {
                return true; // Có sự trùng lặp, không cho phép thêm mới sản phẩm
            }
        }
    }
    return false; // Không có sự trùng lặp
}


 $scope.create = function() {
        var item = angular.copy($scope.form);
        if (item.start_Date > item.end_Date) {
            alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc!");
            return; // Ngừng hàm và không tiến hành tạo mới
        }

        // Check for duplicate products and overlapping time periods
        if (hasOverlappingPeriod(item)) {
            alert("Sản phẩm giảm giá của bạn thêm trùng thời gian rồi!");
            return;
        }

        $http.post(`/rest/discountProduct`, item).then(resp => {
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
			return; // Ngừng hàm và không tiến hành cập nhật
		}

		

		$http.put(`/rest/discountProduct/${item.id}`, item).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items[index] = item;
			alert("Cập nhật mã giảm giá thành công!");
		}).catch(error => {
			alert("Lỗi cập nhật mã giảm giá sản phẩm đơn hàng!");
			console.log("Error", error);
		});
	}

	$scope.delete = function(item) {
		if (confirm("Bạn muốn xóa lịch sử đơn hàng này?")) {
			$http.delete(`/rest/discountProduct/${item.id}`).then(resp => {
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
		size: 10,
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
