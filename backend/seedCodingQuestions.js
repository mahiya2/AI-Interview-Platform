const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
require('dotenv').config();

const CodingQuestion = require('./models/CodingQuestion');

const codingQuestions = [
  {
    title: 'Two Sum',
    description:
      'Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.',
    difficulty: 'Easy',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
      },
    ],
    constraints:
      '2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9',
    testCases: [
      {
        input: '[2,7,11,15]\n9',
        expectedOutput: '[0,1]',
      },
    ],
  },

  {
    title: 'Reverse String',
    description:
      'Write a function that reverses a string. The input string is given as an array of characters.',
    difficulty: 'Easy',
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
    ],
    constraints:
      '1 <= s.length <= 10^5',
    testCases: [
      {
        input: 'hello',
        expectedOutput: 'olleh',
      },
    ],
  },

  {
    title: 'Palindrome Number',
    description:
      'Given an integer x, return true if x is a palindrome, and false otherwise.',
    difficulty: 'Easy',
    examples: [
      {
        input: 'x = 121',
        output: 'true',
      },
      {
        input: 'x = 123',
        output: 'false',
      },
    ],
    constraints:
      '-2^31 <= x <= 2^31 - 1',
    testCases: [
      {
        input: '121',
        expectedOutput: 'true',
      },
    ],
  },

  {
    title: 'Valid Parentheses',
    description:
      'Given a string containing brackets, determine if the input string has valid matching parentheses.',
    difficulty: 'Easy',
    examples: [
      {
        input: 's = "()"',
        output: 'true',
      },
      {
        input: 's = "([)]"',
        output: 'false',
      },
    ],
    constraints:
      '1 <= s.length <= 10^4',
    testCases: [
      {
        input: '()[]{}',
        expectedOutput: 'true',
      },
    ],
  },

  {
    title: 'Best Time to Buy and Sell Stock',
    description:
      'Given an array of prices where prices[i] is the price of a stock on day i, find the maximum profit you can achieve by buying on one day and selling on a later day.',
    difficulty: 'Easy',
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
      },
    ],
    constraints:
      '1 <= prices.length <= 10^5',
    testCases: [
      {
        input: '[7,1,5,3,6,4]',
        expectedOutput: '5',
      },
    ],
  },

  {
    title: 'Binary Search',
    description:
      'Given a sorted array of integers and a target value, return the index of the target if it exists. Otherwise, return -1.',
    difficulty: 'Easy',
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
      },
    ],
    constraints:
      '1 <= nums.length <= 10^4',
    testCases: [
      {
        input: '[-1,0,3,5,9,12]\n9',
        expectedOutput: '4',
      },
    ],
  },

  {
    title: 'Contains Duplicate',
    description:
      'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    difficulty: 'Easy',
    examples: [
      {
        input: 'nums = [1,2,3,1]',
        output: 'true',
      },
      {
        input: 'nums = [1,2,3,4]',
        output: 'false',
      },
    ],
    constraints:
      '1 <= nums.length <= 10^5',
    testCases: [
      {
        input: '[1,2,3,1]',
        expectedOutput: 'true',
      },
    ],
  },

  {
    title: 'Maximum Subarray',
    description:
      'Given an integer array nums, find the subarray with the largest sum and return its sum.',
    difficulty: 'Medium',
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
      },
    ],
    constraints:
      '1 <= nums.length <= 10^5',
    testCases: [
      {
        input: '[-2,1,-3,4,-1,2,1,-5,4]',
        expectedOutput: '6',
      },
    ],
  },

  {
    title: 'Merge Two Sorted Arrays',
    description:
      'Given two sorted arrays, merge them into a single sorted array.',
    difficulty: 'Medium',
    examples: [
      {
        input: '[1,3,5] and [2,4,6]',
        output: '[1,2,3,4,5,6]',
      },
    ],
    constraints:
      'Both arrays contain integers in non-decreasing order.',
    testCases: [
      {
        input: '[1,3,5]\n[2,4,6]',
        expectedOutput: '[1,2,3,4,5,6]',
      },
    ],
  },

  {
    title: 'Longest Substring Without Repeating Characters',
    description:
      'Given a string s, find the length of the longest substring without repeating characters.',
    difficulty: 'Medium',
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
      },
      {
        input: 's = "bbbbb"',
        output: '1',
      },
    ],
    constraints:
      '0 <= s.length <= 5 * 10^4',
    testCases: [
      {
        input: 'abcabcbb',
        expectedOutput: '3',
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected successfully ✅');

    await CodingQuestion.deleteMany({});

    await CodingQuestion.insertMany(codingQuestions);

    console.log(
      `${codingQuestions.length} coding questions added successfully ✅`
    );

    await mongoose.connection.close();

    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error seeding coding questions ❌');
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();