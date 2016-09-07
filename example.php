<!doctype html>
<html>
	<head>
		<meta charset="UTF-8">
		<script src="testy.js"></script>

		<script>
			describe('Testy', function () {
				describe('Comparison', function () {
					it('Should determine if two values are the same', function () {
						assert(that("Hello").equals("Hello"));
					});

					it('Should determine if two values are different', function () {
						assert(that("Hello").is.not("Goodbye"));
					});
				});

				describe('Type checking', function () {
					it('Should check the type of the value', function () {
						assert(that("Hello").is.a.string);
						assert(that(1).is.a.number);
						assert(that(function(){}).is.a.function);
						assert(that({}).is.an.object);
						assert(that([]).is.an.array);
					});
				});

				describe('Booleans', function () {
					it('Should verify a boolean condition', function () {
						assert(that(true).is.true);
						assert(that(1).is.truthy);
						assert(that(false).is.false);
						assert(that(0).is.falsy);
					});
				});

				describe('Undefined or null values', function () {
					it('Should report as undefined or null', function () {
						assert(that(undefined).is.undefined);
						assert(that(null).is.null);
					});
				});
			});
		</script>
	</head>

	<body>
	</body>
</html>