# frozen_string_literal: true

# returns the number of bits required to store n.
# n should be an integer.
def get_bit_length(n)
  if n.zero?
    # we require no bit to store 0.
    # That is, absence of bit is considered 0.
    0
  else
    1 + get_bit_length(n >> 1)
  end
end

def nearest_pow_2(n)
  # returns next number which is a power of 2.
  if (n & (n - 1)).zero
    # n is already a power of 2.
    return n
  end

  # current number is not already power of 2.
  # answer is pow(2, ⌈log2(n)⌉)
  # number of bits required to represent n is ⌈log2(n)⌉.
  1 << get_bit_length(n)
end
