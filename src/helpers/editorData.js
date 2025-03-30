export const languageMap = {
    c: 'c',
    'c++': 'c++',
    java: 'java',
    python: 'python',
    javascript: 'javascript',
    typescript: 'typescript',
    csharp: 'csharp',
    php: 'php',
    ruby: 'ruby',
    go: 'go',
    rust: 'rust',
    swift: 'swift',
    kotlin: 'kotlin',
    sql: 'sql',
    perl: 'perl',
    r: 'r',
    scala: 'scala',
    bash: 'shell',
    shell: 'shell',
    pascal: 'pascal',
    fortran: 'fortran',
    haskell: 'haskell',
    objectivec: 'objective-c',
    assembly: 'asm',
};

// Sample code templates for different languages
export const codeTemplates = {
    c: '#include <stdio.h>\n\nint main() {\n    // Your solution here\n    return 0;\n}',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your solution here\n    return 0;\n}',
    java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Your solution here\n    }\n}',
    python:
        '# Your solution here\ndef solve():\n    n = int(input())\n    a = list(map(int, input().split()))\n    # Write your code here\n    \nsolve()',
    javascript:
        '// Your solution here\nfunction solve() {\n    const input = readline().split(" ").map(Number);\n    // Write your code here\n}\n\nsolve();',
    typescript:
        'function solve(): void {\n    const input = readline().split(" ").map(Number);\n    // Write your code here\n}\n\nsolve();',
    csharp:
        'using System;\n\nclass Program {\n    static void Main() {\n        // Your solution here\n    }\n}',
    php: '<?php\n    // Your solution here\n?>',
    ruby: '# Your solution here',
    go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Your solution here\n}',
    default: '# Your solution here',
};

// Sample problems
export const problems = [
    {
        id: 'sum-of-numbers',
        title: 'Sum of Two Numbers',
        difficulty: 'Easy',
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `# Sum of Two Numbers

## Problem Statement
Given two integers **A** and **B**, compute their sum.

## Input/Output Format
### Input Format
- The first line contains an integer **T**, the number of test cases
- Each of the next **T** lines contains two space-separated integers **A** and **B**

### Output Format
- For each test case, output a single line containing the sum of **A** and **B**

## Examples
### Example 1
**Input:**
\`\`\`
2
1 2
3 4
\`\`\`

**Output:**
\`\`\`
3
7
\`\`\`

**Explanation:**
| Test Case | Calculation | Result |
|-----------|-------------|--------|
| 1         | 1 + 2       | 3      |
| 2         | 3 + 4       | 7      |

### Example 2
**Input:**
\`\`\`
3
-5 10
0 0
1000000000 1000000000
\`\`\`

**Output:**
\`\`\`
5
0
2000000000
\`\`\`
`,
        examples: [
            {
                input: '2\n1 2\n3 4',
                output: '3\n7',
                explanation:
                    'For the first test case, 1 + 2 = 3. For the second test case, 3 + 4 = 7.',
            },
        ],
        testCases: [
            { input: '1 2', output: '3', isHidden: false },
            { input: '3 4', output: '7', isHidden: false },
            { input: '-5 10', output: '5', isHidden: false },
            { input: '10 10', output: '20', isHidden: true },
            { input: '-10 -10', output: '-20', isHidden: true },
        ],
        solutionTemplate: {
            python:
                'def solve():\n    t = int(input())\n    for _ in range(t):\n        a, b = map(int, input().split())\n        print(a + b)\n\nsolve()',
            cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int t;\n    cin >> t;\n    while(t--) {\n        long long a, b;\n        cin >> a >> b;\n        cout << a + b << endl;\n    }\n    return 0;\n}',
            java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int t = sc.nextInt();\n        while(t-- > 0) {\n            long a = sc.nextLong();\n            long b = sc.nextLong();\n            System.out.println(a + b);\n        }\n    }\n}',
        },
    },
    {
        id: 'prime-number',
        title: 'Check Prime Number',
        difficulty: 'Easy',
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `# Prime Number Check

## Problem Statement
Determine if a given positive integer **N** is a prime number.

> A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.

## Algorithm Approach
We can use the following optimized approach:
1. Check if N ≤ 1 → Not prime
2. Check if N ≤ 3 → Prime
3. Check if N is divisible by 2 or 3 → Not prime
4. Check divisors up to √N in the form 6k ± 1

## Input/Output Format
### Input Format
\`\`\`
T       # Number of test cases
N₁      # First number to check
N₂      # Second number to check
...
N_T     # T-th number to check
\`\`\`

### Output Format
\`\`\`
Prime       # If number is prime
Not Prime   # If number is not prime
\`\`\`

## Examples
### Example 1
**Input:**
\`\`\`text
3
2
4
17
\`\`\`

**Output:**
\`\`\`text
Prime
Not Prime
Prime
\`\`\`

### Example 2
**Edge Cases:**
\`\`\`text
4
1
0
97
1000000
\`\`\`

**Output:**
\`\`\`text
Not Prime
Not Prime
Prime
Not Prime
\`\`\`
`,
        examples: [
            {
                input: '3\n2\n4\n17',
                output: 'Prime\nNot Prime\nPrime',
                explanation:
                    '2 and 17 are prime numbers, while 4 is not a prime number.',
            },
        ],
        testCases: [
            { input: '2', output: 'Prime', isHidden: false },
            { input: '4', output: 'Not Prime', isHidden: false },
            { input: '17', output: 'Prime', isHidden: false },
            { input: '1', output: 'Not Prime', isHidden: true },
            { input: '97', output: 'Prime', isHidden: true },
        ],
        solutionTemplate: {
            python:
                'def is_prime(n):\n    if n <= 1:\n        return False\n    if n <= 3:\n        return True\n    if n % 2 == 0 or n % 3 == 0:\n        return False\n    i = 5\n    while i * i <= n:\n        if n % i == 0 or n % (i + 2) == 0:\n            return False\n        i += 6\n    return True\n\ndef solve():\n    t = int(input())\n    for _ in range(t):\n        n = int(input())\n        if is_prime(n):\n            print("Prime")\n        else:\n            print("Not Prime")\n\nsolve()',
            cpp: '#include <iostream>\nusing namespace std;\n\nbool isPrime(int n) {\n    if (n <= 1) return false;\n    if (n <= 3) return true;\n    if (n % 2 == 0 || n % 3 == 0) return false;\n    for (int i = 5; i * i <= n; i += 6) {\n        if (n % i == 0 || n % (i + 2) == 0) return false;\n    }\n    return true;\n}\n\nint main() {\n    int t;\n    cin >> t;\n    while(t--) {\n        int n;\n        cin >> n;\n        if (isPrime(n)) {\n            cout << "Prime" << endl;\n        } else {\n            cout << "Not Prime" << endl;\n        }\n    }\n    return 0;\n}',
        },
    },
    {
        id: 'array-sum',
        title: 'Sum of Array Elements',
        difficulty: 'Easy',
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `# Array Summation

## Problem Statement
Given an array of integers, compute the sum of all elements.

## Performance Considerations
- The solution should efficiently handle large arrays (up to 10⁵ elements)
- Time complexity should be O(N) per test case
- Space complexity should be O(1) additional space

## Input/Output Specification
### Input
\`\`\`text
T           # Test cases
N₁          # Size of first array
a₁ a₂ ...   # Array elements
N₂          # Size of second array
b₁ b₂ ...   # Array elements
...
\`\`\`

### Output
\`\`\`text
sum₁        # Sum of first array
sum₂        # Sum of second array
...
\`\`\`

## Sample Cases
### Sample 1
**Input:**
\`\`\`text
2
5
1 2 3 4 5
3
10 20 30
\`\`\`

**Output:**
\`\`\`text
15
60
\`\`\`

### Sample 2
**Negative Numbers:**
**Input:**
\`\`\`text
3
3
-1 -2 -3
1
0
4
5 -5 10 -10
\`\`\`

**Output:**
\`\`\`text
-6
0
0
\`\`\`
`,
        examples: [
            {
                input: '2\n5\n1 2 3 4 5\n3\n10 20 30',
                output: '15\n60',
                explanation:
                    'For the first test case, 1 + 2 + 3 + 4 + 5 = 15. For the second test case, 10 + 20 + 30 = 60.',
            },
        ],
        testCases: [
            { input: '5\n1 2 3 4 5', output: '15', isHidden: false },
            { input: '3\n10 20 30', output: '60', isHidden: false },
            { input: '4\n-1 -2 -3 -4', output: '-10', isHidden: false },
            { input: '1\n0', output: '0', isHidden: true },
            { input: '10\n1 2 3 4 5 6 7 8 9 10', output: '55', isHidden: true },
        ],
        solutionTemplate: {
            python:
                'def solve():\n    t = int(input())\n    for _ in range(t):\n        n = int(input())\n        arr = list(map(int, input().split()))\n        print(sum(arr))\n\nsolve()',
            cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int t;\n    cin >> t;\n    while(t--) {\n        int n;\n        cin >> n;\n        vector<int> arr(n);\n        int sum = 0;\n        for(int i = 0; i < n; i++) {\n            cin >> arr[i];\n            sum += arr[i];\n        }\n        cout << sum << endl;\n    }\n    return 0;\n}',
        },
    },
];