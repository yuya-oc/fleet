/* eslint-disable camelcase */

import assert from 'assert';
import * as actions from '../../app/actions';
import gameData from '../../app/reducers/gameData';

describe('gameData.js', function () {
	beforeEach(function () {
		this.data = {
			user: {
				api_deck_port: [
					{api_ship: [11, 12, 13, 14, 15, 16]},
					{api_ship: [21, 22, 23, 24, 25, 26]},
					{api_ship: [31, -1, -1, -1, -1, -1]}
				]
			},
			presetDeck: {
				api_deck: [
					{api_name: '第1艦隊', api_ship: [51, 52, 53, 54, 55, 56]},
					{api_name: '第2艦隊', api_ship: [61, 62, 63, 64, 65, 66]}
				]
			}
		};
	});

	describe('SET_KCSAPI_DECK_SHIP', function () {
		it('should set selected ship', function () {
			const newData = gameData(this.data, actions.setKcsapiDeckShip({
				api_ship_id: 100,
				api_id: 2,
				api_ship_idx: 3
			}));
			assert.deepEqual(newData.user.api_deck_port[1].api_ship, [21, 22, 23, 100, 25, 26]);
		});

		it('should replace existing ship of same deck', function () {
			const newData2 = gameData(this.data, actions.setKcsapiDeckShip({
				api_ship_id: 11,
				api_id: 1,
				api_ship_idx: 3
			}));
			assert.deepEqual(newData2.user.api_deck_port[0].api_ship, [14, 12, 13, 11, 15, 16]);
		});

		it('should replace existing ship of another deck', function () {
			const newData3 = gameData(this.data, actions.setKcsapiDeckShip({
				api_ship_id: 11,
				api_id: 2,
				api_ship_idx: 3
			}));
			assert.deepEqual(newData3.user.api_deck_port[0].api_ship, [24, 12, 13, 14, 15, 16]);
			assert.deepEqual(newData3.user.api_deck_port[1].api_ship, [21, 22, 23, 11, 25, 26]);
		});

		it('should move ship to blank slot', function () {
			const newData = gameData(this.data, actions.setKcsapiDeckShip({
				api_ship_id: 11,
				api_id: 3,
				api_ship_idx: 1
			}));
			assert.deepEqual(newData.user.api_deck_port[0].api_ship, [12, 13, 14, 15, 16, -1]);
			assert.deepEqual(newData.user.api_deck_port[2].api_ship, [31, 11, -1, -1, -1, -1]);
		});

		it('should handle data.api_ship_id === -1', function () {
			// 編成画面で「はずす」を選択
			const newData1 = gameData(this.data, actions.setKcsapiDeckShip({
				api_ship_id: -1,
				api_id: 1,
				api_ship_idx: 1
			}));
			assert.deepEqual(newData1.user.api_deck_port[0].api_ship, [11, 13, 14, 15, 16, -1]);

			const newData2 = gameData(this.data, actions.setKcsapiDeckShip({
				api_ship_id: -1,
				api_id: 2,
				api_ship_idx: 3
			}));
			assert.deepEqual(newData2.user.api_deck_port[1].api_ship, [21, 22, 23, 25, 26, -1]);
		});

		it('should handle data.api_ship_id === -2', function () {
			// 編成画面で「随伴艦一括解除」を選択
			const newData1 = gameData(this.data, actions.setKcsapiDeckShip({
				api_ship_id: -2,
				api_id: 1
			}));
			assert.deepEqual(newData1.user.api_deck_port[0].api_ship, [11, -1, -1, -1, -1, -1]);

			const newData2 = gameData(this.data, actions.setKcsapiDeckShip({
				api_ship_id: -2,
				api_id: 2
			}));
			assert.deepEqual(newData2.user.api_deck_port[1].api_ship, [21, -1, -1, -1, -1, -1]);
		});
	});

	describe('SET_KCSAPI_PRESET_SELECT', function () {
		it('should restore selected preset deck', function () {
			const newData = gameData(this.data, actions.setKcsapiPresetSelect({
				api_deck_id: 1,
				api_preset_no: 0
			}));
			assert.deepEqual(newData.user.api_deck_port[0].api_ship, [51, 52, 53, 54, 55, 56]);
		});

		it('should NOT restore assigned ship', function () {
			this.data.presetDeck.api_deck[0].api_ship = [31, 52, 53, 54, 55, 56];
			const newData = gameData(this.data, actions.setKcsapiPresetSelect({
				api_deck_id: 1,
				api_preset_no: 0
			}));
			assert.deepEqual(newData.user.api_deck_port[0].api_ship, [52, 53, 54, 55, 56, -1]);
		});

		it('should restore existing ship', function () {
			this.data.presetDeck.api_deck[0].api_ship = [51, 11, 53, 54, 55, 56];
			const newData = gameData(this.data, actions.setKcsapiPresetSelect({
				api_deck_id: 1,
				api_preset_no: 0
			}));
			assert.deepEqual(newData.user.api_deck_port[0].api_ship, [51, 11, 53, 54, 55, 56]);
		});
	});
});
