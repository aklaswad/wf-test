use strict;
use warnings;
use Test::More;

is( 0, 1, 'Zero is One');

is_deeply({ foo => { bar => 42 }}, { foo => { bar => 43 }}, 'Deep thought' );
done_testing()
