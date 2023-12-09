app.controller("contacts-ctrl", function($scope, $http) {
	$scope.items = [];
	$scope.form = {};

	$scope.initialize = function() {
		
		$http.get("/rest/contact").then(resp => {
			$scope.items = resp.data;
		});
		$scope.reset(); //để có hình mây lyc1 mới đầu
		$scope.loadCurrentUser();
	}
	$scope.create = function() {
		var item = angular.copy($scope.form);

		$http.post(`/rest/contact`, item).then(resp => {
			$scope.items.push(resp.data);
			$scope.reset();
			alert("Thêm mới thành công!");
		}).catch(error => {
			alert("Lỗi thêm mới!");
			console.log("Error", error);
		});
	}
$scope.loadCurrentUser = function() {
    $http.get("/rest/accounts/current-account").then(resp => {
        $scope.account = resp.data;
    }); 
};

	$scope.edit = function(item) {
		$scope.form = angular.copy(item);
			$scope.form.createDate = new Date(item.createDate);
	}

	$scope.reset = function() {
		$scope.form = {};
	}

	$scope.update = function() {
		var item = angular.copy($scope.form);
		$http.put(`/rest/contact/${item.id}`, item).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items[index] = item;
			alert("Cập nhật thành công!");
		})
			.catch(error => {
				alert("Lỗi cập nhật!");
				console.log("Error", error);
			});
	}

	$scope.delete = function(item) {
		if (confirm("Bạn muốn xóa thông tin này?")) {
			$http.delete(`/rest/contact/${item.id}`).then(resp => {
				var index = $scope.items.findIndex(p => p.id == item.id);
				$scope.items.splice(index, 1);
				$scope.reset();
				alert("Xóa thành công!");
			}).catch(error => {
				alert("Lỗi xóa!");
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