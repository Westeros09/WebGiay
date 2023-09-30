const app = angular.module("app", [])
app.controller("cart-ctrl", function($scope, $http) {
	// quản lý giỏ hàng
	/*$scope.prodd = [
		{ size: '36' },
		{ size: '37' },
		{ size: '39' },
		{ size: '40' },
		{ size: '41' },
		{ size: '42' },
		// ... Thêm dữ liệu size giày vào đây
	];*/

	$scope.selectedSize = ''; // Ban đầu không có size nào được chọn
	$scope.cart = [];




	var $cart = $scope.cart = {
		items: [],
		add(id) {
			if (!$scope.selectedSize) {
				alert('Vui lòng chọn size. ');
				return;
			}

			// Lấy giá trị từ biến totalAmount và sử dụng nó khi thêm sản phẩm
			var item = this.items.find(item => item.id == id && item.sizes == $scope.selectedSize);
			if (item) {
				item.qty++;
				this.saveToLocalStorage();
			} else {
				$http.get(`/rest/products/${id}`).then(resp => {
					resp.data.qty = 1;
					resp.data.sizes = $scope.selectedSize;
					this.items.push(resp.data);
					this.saveToLocalStorage();
				});
			}
		},
		remove(id) { // xóa sản phẩm khỏi giỏ hàng
			var index = this.items.findIndex(item => item.id == id);
			this.items.splice(index, 1);
			this.saveToLocalStorage();
		},
		clear() { // Xóa sạch các mặt hàng trong giỏ
			this.items = []
			this.saveToLocalStorage();
		},
		price_product(item) {
			if (item.discount_sale == null) {
				return item.price
			} else {
				return (item.price - (item.price * item.discount_sale.percentage / 100))
			}
		},


		amtt_of(item) {
			var itemPrice = this.price_product(item); // Gọi hàm price_product(item) từ cùng đối tượng
			return itemPrice * item.qty; // Tính giá tiền của sản phẩm với số lượng
		},

		amt_of(item) { // tính thành tiền của 1 sản phẩm
			return item.price * item.qty;
		},
		get count() { // tính tổng số lượng các mặt hàng trong giỏ
			return this.items
				.map(item => item.qty)
				.reduce((total, qty) => total += qty, 0);
		},
		get amount() { // tổng thành tiền các mặt hàng trong giỏ
			return this.items
				.map(item => this.amtt_of(item))
				.reduce((total, amt) => total += amt, 0);
		},
		saveToLocalStorage() { // lưu giỏ hàng vào local storage
			var json = JSON.stringify(angular.copy(this.items));
			localStorage.setItem("cart", json);
		},
		loadFromLocalStorage() { // đọc giỏ hàng từ local storage
			var json = localStorage.getItem("cart");
			this.items = json ? JSON.parse(json) : [];
		}
	}

	$cart.loadFromLocalStorage();

	// Đặt hàng
	$scope.order = {
		get account() {
			return { username: $auth.user.username }
		},
		createDate: new Date(),
		address: "",
		get orderDetails() {
			return $cart.items.map(item => {
				return {
					product: { id: item.id },
					price: item.price,
					quantity: item.qty
				}
			});
		},
		purchase() {
			var order = angular.copy(this);
			// Thực hiện đặt hàng
			$http.post("/rest/orders", order).then(resp => {
				alert("Đặt hàng thành công!");
				$cart.clear();
				location.href = "/order/detail/" + resp.data.id;
			}).catch(error => {
				alert("Đặt hàng lỗi!")
				console.log(error)
			})
		}
	}
})