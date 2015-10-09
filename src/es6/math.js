if (!('sign' in Math)) {
	Object.defineProperty(Math, 'sign', {
		value: function(n) {
			return isNaN(n) ? NaN : (
				n > 0 ? 1 : (
					n < 0 ? -1 : 0
				)
			);
		}
	});
}

