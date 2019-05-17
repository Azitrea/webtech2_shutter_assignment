const assert = require('assert');
const sinon = require('sinon');
const mocha = require('mocha');

const customerService = require('./../service/CustomerService');

let DAO = {
    getMyOrders: function (id) {
        return [{
            "_id": '11',
            "name": 'Name1',
            "email": "example@example.com",
            "address": "This street, That road",
            "phone": "012345678",
            "orderIDs": [
                {
                    "OrderID": "1111",
                    "status": "Order Accepted"
                }
            ]
        }]
    },
    getMyShuttersByID: function (ordID) {
        return [{
            "_id": "10249",
            "Window": "123 X 412",
            "shutterType": "4",
            "color": "blue",
            "material": "plastic",
            "comment": "",
            "orderID": "1111",
            "customerID": "39",
            "status": "Available",
            "price": 410
        }]

    }
};

const custService = new customerService(DAO);

describe("Customer service my shutters by ID: ", function () {
    it("It should return with customer not found when customer ID is undefined or not existing", function () {
        custService.myShuttersById("", "", (success) => {

        }, (err) => {
            assert.strictEqual(err, "Customer not found:")
        })
    });
    it("It should return a shutter with what order ID", function () {
        custService.myShuttersById("11", "1111", (success) => {
            assert.strictEqual(success[0]['id'], "10249")
            assert.strictEqual(success[0]['Window'], "123 X 412")
            assert.strictEqual(success[0]['shutterType'], "4")
            assert.strictEqual(success[0]['color'], "blue")
            assert.strictEqual(success[0]['material'], "plastic")
            assert.strictEqual(success[0]['comment'], "")
            assert.strictEqual(success[0]['orderID'], "1111")
            assert.strictEqual(success[0]['customerID'], "39")
            assert.strictEqual(success[0]['status'], "Available")
            assert.strictEqual(success[0]['price'], 410)

        })
    });
    it("It should return 'This is not your order' when wrong order is is given", function () {
        custService.myShuttersById("11", "0123", (success) => {

        }, (err) => {
            assert.strictEqual(err, "This is not your order")
        })
    });
    it("getMyOrders should called once", function () {
        let sinonSpy = sinon.spy(custService, 'myShuttersById');
        custService.myShuttersById("11", "1111", (success) => {
            assert.strictEqual(sinonSpy.calledOnce, true);
        })
    })

});

