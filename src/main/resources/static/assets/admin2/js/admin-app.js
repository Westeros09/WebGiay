const app = angular.module("app1", ["ngRoute"]);
app.controller("main", function($scope, $location) {
	$scope.isActive = function(viewLocation) {
		return viewLocation === $location.path();
	}
})
app.config(function($routeProvider) {
	$routeProvider
		.when("/dashboard", {
			templateUrl: "/assets/admin2/pages/dashboard/index.html",
			controller: "dashboard-ctrl"
		})
		.when("/table", {
			templateUrl: "/assets/admin2/pages/tables.html",
		})
		.when("/billing", {
			templateUrl: "/assets/admin2/pages/billing.html",
		})
		.when("/product", {
			templateUrl: "/assets/admin2/pages/product/index.html",
			controller: "product-ctrl"
		}).when("/history", {
			templateUrl: "/assets/admin2/pages/history.html",
			controller: "history-ctrl"
		})
		.when("/discount", {
			templateUrl: "/assets/admin2/pages/discountCode/index.html",
			controller: "discount-ctrl"
		}).when("/discountProduct", {
			templateUrl: "/assets/admin2/pages/discountProduct/index.html",
			controller: "discountProduct-ctrl"
		}).when("/size", {
			templateUrl: "/assets/admin2/pages/size/index.html",
			controller: "size-ctrl"
		}).when("/category", {
			templateUrl: "/assets/admin2/pages/category/index.html",
			controller: "category-ctrl"
		}).when("/address", {
			templateUrl: "/assets/admin2/pages/address.html",
			controller: "address-ctrl"
		})
		.when("/authority", {
			templateUrl: "/assets/admin2/pages/authority/index.html",
			controller: "authority-ctrl"

		}).when("/unauthorized", {
			templateUrl: "/assets/admin2/pages/authority/unauthorized.html",
			controller: "authority-ctrl"

		}).when("/account", {
			templateUrl: "/assets/admin2/pages/account.html",
			controller: "account-ctrl"

		}).when("/profile", {
			templateUrl: "/assets/admin2/pages/profile.html",
		})
		.when("/unauthorized", {
			templateUrl: "/assets/admin2/pages/authority/unauthorized.html",
			controller: "authority-ctrl"
		})
		.when("/comments", {
			templateUrl: "/assets/admin2/pages/comment/index.html",
			controller: "comments-ctrl"
		})
		.when("/contacts", {
			templateUrl: "/assets/admin2/pages/contact/index.html",
			controller: "contacts-ctrl"
		})
		.otherwise({
			redirectTo: "/dashboard"
		});

});