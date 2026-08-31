# SharpSkript
<img src="logo.png" width=100 height=100 />

SharpSkript is a language i have been making that is like my own superset of javascript (kinda like typescript or elmscript). I will store the documentation here for now.

## Libraries

Sharpskript uses the following:
* chevrotain for lexing, parsing, and compiling
* ink for the console because i love react
* typescript as the main language

right now i wont release it in standalone format as you cant really do much right now, ill do that after if statements, loops, and functions are implemented

## Syntax
semi colons are optional, i just like them

### Comments
only single lined comments for now:
```
-#- this is a comment
```

### Variables
```
[scope] [type] [declaration] [name] = [value];
```
#### Scope
there are 2 scopes currently:
* local : variables you can only use inside of the scope initialized at
* global : variable you can use across the program

#### Type
there are currently 6 types:
* string : Strings, words/sentences inside "" ("Hello world")
* int : Integers, whole numbers (0, 1, 2, 3...)
* bool : Booleans, true or false
* double : Decimal Numbers, (0.01, 2.1)
* char : Single characters inside '' ('e')
* null : null value (null)

#### Declaration
there are 2 declarations:
* const : for immutable variables, aka constants
* var : for mutable variables

if you are assigning a value that could be null, then put a "?" after the type (see example)

#### Example
```
local string var msg = "Hello";
local string? const isNull = null; -#- null values

-#- re-assigning
msg = "Yo";
```

### Print Statement
its like python
```
print(msg);
print(1);
print("Hello World");
print('e');
```

### Expressions
Integer and double values can be combined with `+`, `-`, `*`, `/`, and `^`.
Parentheses control evaluation order; otherwise exponentiation is evaluated first,
then multiplication/division, then addition/subtraction.

```
local int var total = 1 + 2 * 3;
local double var average = (total + 1) / 2;
print(average);
```

Expressions may use previously declared `int` and `double` variables. Other
types, undeclared variables, and `null` values produce semantic errors.

## CLI
there is only 1 command (once i bundle the typescript)

```
sharplang run <file>
```
this runs it for you

right now, run like this:
```node dist/cli.js run your_file.sharp```

if you clone this project, then u can use this to run example.sharp
```npm run test```
