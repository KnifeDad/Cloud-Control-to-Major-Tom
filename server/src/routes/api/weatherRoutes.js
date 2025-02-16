"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var historyService_js_1 = require("../../service/historyService.js");
var weatherService_js_1 = require("../../service/weatherService.js");
var router = (0, express_1.Router)();
// POST Request with city name to retrieve weather data
router.post('/', function (req, res) {
    var city = req.body.city;
    weatherService_js_1.default.getWeatherData(city)
        .then(function (_a) {
        var newCity = _a.city, weather = _a.weather;
        return historyService_js_1.default.addCity(newCity)
            .then(function () {
            res.json({ city: newCity, weather: weather });
        });
    })
        .catch(function (error) {
        if (error.message === 'City not found') {
            res.status(404).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Error processing weather request' });
        }
    });
});
// GET search history
router.get('/history', function (req, res) {
    historyService_js_1.default.getCities()
        .then(function (cities) {
        res.json(cities);
    })
        .catch(function () {
        res.status(500).json({ error: 'Error reading search history' });
    });
});
// DELETE city from search history
router.delete('/history/:id', function (req, res) {
    var id = req.params.id;
    historyService_js_1.default.deleteCity(id)
        .then(function () {
        res.json({ message: 'City deleted successfully' });
    })
        .catch(function () {
        res.status(500).json({ error: 'Error deleting city' });
    });
});
exports.default = router;
