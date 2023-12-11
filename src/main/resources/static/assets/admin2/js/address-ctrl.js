app.controller("address-ctrl", function($scope, $http) {
	$scope.items = [];
	$scope.form = {};

	$scope.initialize = function(){
		$http.get("/rest/address").then(resp => {
			$scope.items = resp.data;
			console.log(resp.data);
			console.log(resp.data.addressDetail);
			$scope.form = {
				available : true,
			};
		})

		$scope.reset(); //để có hình mây lyc1 mới đầu
		$scope.loadCurrentUser();
	}
		$scope.edit = function(item) {
		$scope.form = angular.copy(item);

	}
	$scope.create = function() {
		var item = angular.copy($scope.form);
		$http.post(`/rest/address`, item).then(resp => {
			$scope.items.push(resp.data);
			$scope.reset();

			alert("Thêm mới thành công!");
		}).catch(error => {
			alert("Thêm địa chỉ không thành công");
			console.log("Error", error);
		});
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
	console.log("Province changed");
	let selectedCode = $("#province option:selected").data("code");
	callApiDistrict(host + "p/" + selectedCode + "?depth=2");
});
$("#district").change(() => {
	let selectedCode = $("#district option:selected").data("code");
	callApiWard(host + "d/" + selectedCode + "?depth=2");
});
