import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';
import {
  Loader2,
  Play,
  Save,
  Code2,
  Download,
  Copy,
  Terminal,
  FileCode,
  Settings,
  Maximize,
  Minimize,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  History,
  FileInput,
  AlignLeft,
  TestTube,
  Book,
} from 'lucide-react';
import axios from 'axios';

// Language mapping between Judge0 and Monaco Editor
const languageMap = {
  c: 'c',
  cpp: 'cpp',
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
const codeTemplates = {
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
const problems = [
  {
    id: 'sum-of-numbers',
    title: 'Sum of Two Numbers',
    difficulty: 'Easy',
    timeLimit: 1.0,
    memoryLimit: 256,
    description: `
      Given two integers A and B, find their sum.

      ## Input Format
      The first line contains an integer T, the number of test cases.
      Each of the next T lines contains two space-separated integers A and B.

      ## Output Format
      For each test case, output a single line containing the sum of A and B.

      ## Constraints
      - 1 ≤ T ≤ 1000
      - -10^9 ≤ A, B ≤ 10^9
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
    description: `
      Given a positive integer N, determine whether it is a prime number or not.
      
      A prime number is a natural number greater than 1 that is not a product of two smaller natural numbers.

      ## Input Format
      The first line contains an integer T, the number of test cases.
      Each of the next T lines contains a single integer N.

      ## Output Format
      For each test case, output "Prime" if N is a prime number, otherwise output "Not Prime".

      ## Constraints
      - 1 ≤ T ≤ 100
      - 1 ≤ N ≤ 10^6
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
    description: `
      Given an array of integers, find the sum of all its elements.

      ## Input Format
      The first line contains an integer T, the number of test cases.
      For each test case:
      - The first line contains an integer N, the size of the array.
      - The second line contains N space-separated integers, the elements of the array.

      ## Output Format
      For each test case, output a single line containing the sum of the array elements.

      ## Constraints
      - 1 ≤ T ≤ 100
      - 1 ≤ N ≤ 10^5
      - -10^3 ≤ array elements ≤ 10^3
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

const CodeEditor = () => {
  const BASE_URL = 'http://172.16.103.141:2358';
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('71'); // Python as default
  const [monacoLanguage, setMonacoLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [statusBadge, setStatusBadge] = useState({
    label: 'Ready',
    color: 'bg-green-500',
  });
  const [languages, setLanguages] = useState([]);
  const [theme, setTheme] = useState('vs'); // Using light theme
  const [stdin, setStdin] = useState('');
  const [editorInstance, setEditorInstance] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoFormat, setAutoFormat] = useState(true);
  const [executionTime, setExecutionTime] = useState(null);
  const [memoryUsage, setMemoryUsage] = useState(null);
  const editorContainerRef = useRef(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [editorFontSize, setEditorFontSize] = useState(14);
  const [lineWrap, setLineWrap] = useState(true);

  // Problem-related states
  const [selectedProblem, setSelectedProblem] = useState(problems[0]);
  const [testResults, setTestResults] = useState([]);
  const [showProblem, setShowProblem] = useState(true);
  const [customTestCase, setCustomTestCase] = useState('');
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [editorHeight, setEditorHeight] = useState('65vh'); // Set a default height for the editor

  // Set initial code based on the selected problem
  useEffect(() => {
    if (selectedProblem && languages.length > 0) {
      const selectedLang = languages.find(
        (lang) => lang.id.toString() === language,
      );
      if (selectedLang) {
        const langName = selectedLang.name.toLowerCase().replace(/\s/g, '');
        const monacoLang =
          languageMap[langName] ||
          languageMap[langName.split(/[^a-zA-Z]/)[0]] ||
          'plaintext';

        // Use problem-specific template if available
        if (
          selectedProblem.solutionTemplate &&
          selectedProblem.solutionTemplate[monacoLang]
        ) {
          setCode(selectedProblem.solutionTemplate[monacoLang]);
        } else {
          // Fall back to generic template
          const template =
            codeTemplates[monacoLang] || codeTemplates['default'];
          setCode(template);
        }
      }
    }
  }, [selectedProblem, language, languages]);

  // Fetch available languages on component mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/languages`);
        setLanguages(response.data);
      } catch (error) {
        console.error('Failed to fetch languages:', error);
        setOutput(
          'Failed to connect to Judge0 API. Please check if the server is running.',
        );
        toast.error('Failed to connect to Judge0 API');
      }
    };

    fetchLanguages();
  }, []);

  // Update Monaco language when Judge0 language changes
  useEffect(() => {
    if (languages.length > 0) {
      const selectedLang = languages.find(
        (lang) => lang.id.toString() === language,
      );
      if (selectedLang) {
        const langName = selectedLang.name.toLowerCase().replace(/\s/g, '');
        const monacoLang =
          languageMap[langName] ||
          languageMap[langName.split(/[^a-zA-Z]/)[0]] ||
          'plaintext';

        setMonacoLanguage(monacoLang);
      }
    }
  }, [language, languages]);

  // Handle fullscreen mode
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isFullscreen]);

  const handleEditorDidMount = (editor, monaco) => {
    setEditorInstance(editor);

    // Enable code suggestions
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
    });

    // Enhanced editor settings
    editor.updateOptions({
      fontFamily:
        'JetBrains Mono, Fira Code, Menlo, Monaco, Consolas, monospace',
      fontLigatures: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: true,
      smoothScrolling: true,
      fontSize: editorFontSize,
      wordWrap: lineWrap ? 'on' : 'off',
      guides: {
        bracketPairs: true,
        indentation: true,
      },
    });
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleStdinChange = (value) => {
    setStdin(value);
  };

  const handleCustomTestCaseChange = (value) => {
    setCustomTestCase(value);
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
    toast.info(
      `Switched to ${languages.find((lang) => lang.id.toString() === value)?.name ||
      'new language'
      }`,
    );
  };

  const handleProblemChange = (problemId) => {
    const problem = problems.find((p) => p.id === problemId);
    if (problem) {
      setSelectedProblem(problem);
      setTestResults([]);
      toast.info(`Switched to problem: ${problem.title}`);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const formatCode = () => {
    if (editorInstance) {
      editorInstance.getAction('editor.action.formatDocument').run();
      toast.success('Code formatted');
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const downloadCode = () => {
    const selectedLang = languages.find(
      (lang) => lang.id.toString() === language,
    );
    let extension = 'txt';

    if (selectedLang) {
      switch (monacoLanguage) {
        case 'javascript':
          extension = 'js';
          break;
        case 'python':
          extension = 'py';
          break;
        case 'java':
          extension = 'java';
          break;
        case 'c':
          extension = 'c';
          break;
        case 'cpp':
          extension = 'cpp';
          break;
        case 'csharp':
          extension = 'cs';
          break;
        case 'typescript':
          extension = 'ts';
          break;
        case 'php':
          extension = 'php';
          break;
        case 'html':
          extension = 'html';
          break;
        case 'css':
          extension = 'css';
          break;
        default:
          extension = 'txt';
      }
    }

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedProblem.id}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Downloaded as ${selectedProblem.id}.${extension}`);
  };

  const executeCode = async (input) => {
    try {
      // Create submission
      const createResponse = await axios.post(`${BASE_URL}/submissions`, {
        source_code: code,
        language_id: language,
        stdin: input,
        wait: false,
      });

      const token = createResponse.data.token;

      // Poll for results
      let status;
      let pollResponse;
      let attempts = 0;
      const maxAttempts = 10;
      let interval;

      return new Promise((resolve, reject) => {
        interval = setInterval(async () => {
          attempts++;

          try {
            pollResponse = await axios.get(`${BASE_URL}/submissions/${token}`);
            status = pollResponse.data.status;
            console.log(status);

            // Check if the code has finished executing
            if (status.id >= 3) {
              // 3 = Accepted (finished)
              clearInterval(interval);

              // Format output
              let resultOutput = '';
              if (pollResponse.data.stdout) {
                resultOutput += pollResponse.data.stdout;
              }
              if (pollResponse.data.stderr) {
                resultOutput += pollResponse.data.stderr;
              }
              if (pollResponse.data.compile_output) {
                resultOutput += pollResponse.data.compile_output;
              }
              if (pollResponse.data.message) {
                resultOutput += pollResponse.data.message;
              }

              resultOutput = resultOutput || 'No output';

              resolve({
                status: status,
                output: resultOutput,
                time: pollResponse.data.time,
                memory: pollResponse.data.memory
                  ? (pollResponse.data.memory / 1024).toFixed(2)
                  : null,
              });
            }
          } catch (error) {
            console.error('Error polling submission:', error);
            clearInterval(interval);
            reject(new Error('Error checking submission status'));
          }

          if (attempts >= maxAttempts) {
            clearInterval(interval);
            reject(new Error('Execution timed out'));
          }
        }, 1000);
      });
    } catch (error) {
      console.error('Error submitting code:', error);
      throw new Error(`Error submitting code: ${error.message}`);
    }
  };

  const runCustomTest = async () => {
    setIsRunning(true);
    setStatusBadge({ label: 'Processing', color: 'bg-blue-500' });
    setOutput('Running code...');
    setExecutionTime(null);
    setMemoryUsage(null);

    const startTime = performance.now();

    try {
      const result = await executeCode(stdin || customTestCase);

      const endTime = performance.now();
      const clientExecutionTime = ((endTime - startTime) / 1000).toFixed(2);

      setIsRunning(false);

      // Set status badge
      let statusColor = 'bg-gray-500';
      let statusMessage = result.status.description;

      if (result.status.id === 3) {
        statusColor = 'bg-green-500';
        statusMessage = 'Success';
        toast.success('Code executed successfully');
      } else if (result.status.id === 4) {
        statusColor = 'bg-yellow-500';
        statusMessage = 'Wrong Answer';
        toast.warning('Wrong answer');
      } else if (result.status.id === 5) {
        statusColor = 'bg-red-500';
        statusMessage = 'Time Limit';
        toast.error('Time limit exceeded');
      } else if (result.status.id === 6) {
        statusColor = 'bg-red-500';
        statusMessage = 'Compilation Error';
        toast.error('Compilation error');
      } else {
        toast.info(result.status.description);
      }

      setStatusBadge({ label: statusMessage, color: statusColor });
      setOutput(result.output);

      // Get execution time and memory usage if available
      if (result.time) {
        setExecutionTime(result.time);
      } else {
        setExecutionTime(clientExecutionTime);
      }

      if (result.memory) {
        setMemoryUsage(result.memory);
      }

      // Add to recent submissions
      const newSubmission = {
        id: Date.now(),
        language:
          languages.find((lang) => lang.id.toString() === language)?.name ||
          'Unknown',
        timestamp: new Date().toLocaleTimeString(),
        status: statusMessage,
        time: result.time || clientExecutionTime,
      };

      setRecentSubmissions((prev) => [newSubmission, ...prev].slice(0, 5));
    } catch (error) {
      console.error('Error running code:', error);
      setIsRunning(false);
      setStatusBadge({ label: 'Error', color: 'bg-red-500' });
      setOutput(`Error: ${error.message}`);
      toast.error(`Error running code: ${error.message}`);
    }
  };

  const runTestCase = async (testCase, index) => {
    try {
      const result = await executeCode(testCase.input);

      // Compare output with expected output
      const normalizedActual = result.output.trim();
      const normalizedExpected = testCase.output.trim();
      const passed = normalizedActual === normalizedExpected;

      // Update test results
      setTestResults((prev) => {
        const newResults = [...prev];
        newResults[index] = {
          passed,
          input: testCase.input,
          expected: testCase.output,
          actual: result.output,
          time: result.time,
          memory: result.memory,
          status: result.status,
        };
        return newResults;
      });

      return { passed, result };
    } catch (error) {
      console.error('Error running test case:', error);

      // Update test results with error
      setTestResults((prev) => {
        const newResults = [...prev];
        newResults[index] = {
          passed: false,
          input: testCase.input,
          expected: testCase.output,
          actual: 'Error: ' + error.message,
          error: true,
        };
        return newResults;
      });

      return { passed: false, error: true };
    }
  };

  const runAllTests = async () => {
    setIsTestingAll(true);
    setTestResults([]);

    try {
      let allPassed = true;
      const visibleTestCases = selectedProblem.testCases.filter(
        (tc) => !tc.isHidden,
      );

      // Run visible test cases one by one
      for (let i = 0; i < visibleTestCases.length; i++) {
        const { passed } = await runTestCase(visibleTestCases[i], i);
        if (!passed) allPassed = false;
      }

      if (allPassed) {
        toast.success('All test cases passed!');
      } else {
        toast.error('Some test cases failed');
      }
    } catch (error) {
      console.error('Error running all tests:', error);
      toast.error('Error running all test cases');
    } finally {
      setIsTestingAll(false);
    }
  };

  const submitSolution = async () => {
    setIsTestingAll(true);
    setTestResults([]);

    try {
      let allPassed = true;

      // First run visible test cases
      const visibleTestCases = selectedProblem.testCases.filter(
        (tc) => !tc.isHidden,
      );
      for (let i = 0; i < visibleTestCases.length; i++) {
        const { passed } = await runTestCase(visibleTestCases[i], i);
        if (!passed) allPassed = false;
      }

      // If visible tests pass, run hidden test cases
      if (allPassed) {
        const hiddenTestCases = selectedProblem.testCases.filter(
          (tc) => tc.isHidden,
        );
        let hiddenPassed = true;

        for (let i = 0; i < hiddenTestCases.length; i++) {
          const { passed } = await runTestCase(
            hiddenTestCases[i],
            visibleTestCases.length + i,
          );
          if (!passed) hiddenPassed = false;
        }

        if (hiddenPassed) {
          toast.success(
            'All test cases passed! Solution submitted successfully.',
          );
        } else {
          toast.error('Some hidden test cases failed');
        }
      } else {
        toast.error('Some test cases failed');
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      toast.error('Error submitting solution');
    } finally {
      setIsTestingAll(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-right" richColors />
      {showSettings && (
        <Card className="fixed w-[97vw] top-14 left-0 mx-4 z-100 mb-4 bg-white border-gray-200 text-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Editor Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center justify-between">
                <label htmlFor="font-size" className="text-sm">
                  Font Size: {editorFontSize}px
                </label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 bg-white border-gray-300 text-gray-800"
                    onClick={() => {
                      const newSize = Math.max(10, editorFontSize - 1);
                      setEditorFontSize(newSize);
                      editorInstance?.updateOptions({ fontSize: newSize });
                    }}
                  >
                    -
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 bg-white border-gray-300 text-gray-800"
                    onClick={() => {
                      const newSize = Math.min(24, editorFontSize + 1);
                      setEditorFontSize(newSize);
                      editorInstance?.updateOptions({ fontSize: newSize });
                    }}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="word-wrap" className="text-sm">
                  Word Wrap
                </label>
                <Switch
                  id="word-wrap"
                  checked={lineWrap}
                  onCheckedChange={(checked) => {
                    setLineWrap(checked);
                    editorInstance?.updateOptions({
                      wordWrap: checked ? 'on' : 'off',
                    });
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="auto-format" className="text-sm">
                  Auto Format On Run
                </label>
                <Switch
                  id="auto-format"
                  checked={autoFormat}
                  onCheckedChange={setAutoFormat}
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="show-problem" className="text-sm">
                  Show Problem Panel
                </label>
                <Switch
                  id="show-problem"
                  checked={showProblem}
                  onCheckedChange={setShowProblem}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white max-h-[100vh]' : ''}`}>
        <div className={`flex flex-col max-h-full bg-white text-gray-800 overflow-hidden`} >
          {/* Header */}
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center space-x-2">
              <Code2 className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-blue-600">CodePie</h1>
            </div>

            <div className="flex space-x-4 items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowSettings(!showSettings)}
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Settings</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-48 bg-white border-gray-300 text-gray-800">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 text-gray-800">
                  {languages.map((lang) => (
                    <SelectItem key={lang.id} value={lang.id.toString()}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedProblem.id}
                onValueChange={handleProblemChange}
              >
                <SelectTrigger className="w-64 bg-white border-gray-300 text-gray-800">
                  <SelectValue placeholder="Select Problem" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 text-gray-800">
                  {problems.map((problem) => (
                    <SelectItem key={problem.id} value={problem.id}>
                      {problem.title}{' '}
                      <span className="text-xs ml-2">({problem.difficulty})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFullscreen}
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                      {isFullscreen ? (
                        <Minimize className="h-5 w-5" />
                      ) : (
                        <Maximize className="h-5 w-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Main content layout - now in responsive rows */}
          <div className="flex flex-1 flex-col md:flex-row gap-4 px-4">
            {/* Problem Statement Panel */}
            {showProblem && (
              <div className="md:w-1/3 lg:w-1/4 flex-1">
                <Card className="bg-white border-gray-200 text-gray-800 overflow-hidden p-0">
                  <CardHeader className="py-3 bg-gray-50 rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center text-md font-medium">
                        <Book className="mr-2 h-5 w-5 text-blue-600" />
                        <div>
                          <div className="flex items-center gap-2">
                            {selectedProblem.title}
                            <Badge className="ml-2 bg-blue-600">
                              {selectedProblem.difficulty}
                            </Badge>
                          </div>
                          <CardDescription className="text-gray-500 text-xs mt-1">
                            Time Limit: {selectedProblem.timeLimit}s | Memory
                            Limit: {selectedProblem.memoryLimit} MB
                          </CardDescription>
                        </div>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow p-0 overflow-auto">
                    <Tabs defaultValue="description" className="h-full">
                      <TabsList className="bg-gray-50 w-full justify-start rounded-none border-b border-gray-200 px-2">
                        <TabsTrigger
                          value="description"
                          className="data-[state=active]:bg-white"
                        >
                          <AlignLeft className="mr-1 h-4 w-4" />
                          Description
                        </TabsTrigger>
                        <TabsTrigger
                          value="examples"
                          className="data-[state=active]:bg-white"
                        >
                          <Code2 className="mr-1 h-4 w-4" />
                          Examples
                        </TabsTrigger>
                        <TabsTrigger
                          value="tests"
                          className="data-[state=active]:bg-white"
                        >
                          <TestTube className="mr-1 h-4 w-4" />
                          Test Cases
                        </TabsTrigger>
                      </TabsList>

                      <div className="p-4 overflow-auto h-[calc(100%-40px)]">
                        <TabsContent
                          value="description"
                          className="mt-0 h-full overflow-auto"
                        >
                          <div className="prose max-w-none">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: selectedProblem.description
                                  .replace(/\n\n/g, '<br/>')
                                  .replace(/##\s+([^\n]+)/g, '<h3>$1</h3>'),
                              }}
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="examples" className="mt-0 h-full">
                          {selectedProblem.examples.map((example, index) => (
                            <div key={index} className="mb-6">
                              <h3 className="text-lg font-semibold mb-2">
                                Example {index + 1}
                              </h3>

                              <div className="mb-3">
                                <h4 className="text-sm font-medium text-gray-600 mb-1">
                                  Input:
                                </h4>
                                <pre className="bg-gray-50 p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
                                  {example.input}
                                </pre>
                              </div>

                              <div className="mb-3">
                                <h4 className="text-sm font-medium text-gray-600 mb-1">
                                  Output:
                                </h4>
                                <pre className="bg-gray-50 p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
                                  {example.output}
                                </pre>
                              </div>

                              {example.explanation && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-600 mb-1">
                                    Explanation:
                                  </h4>
                                  <div className="text-sm">
                                    {example.explanation}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </TabsContent>

                        <TabsContent value="tests" className="mt-0 h-full">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Test Cases</h3>
                            <Button
                              onClick={runAllTests}
                              disabled={isTestingAll}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {isTestingAll ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Running...
                                </>
                              ) : (
                                <>
                                  <Play className="mr-2 h-4 w-4" />
                                  Run All Tests
                                </>
                              )}
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <div className="text-xs text-gray-500 mb-1">
                              Note: Hidden test cases are not displayed but will
                              be checked on submission.
                            </div>

                            {selectedProblem.testCases
                              .filter((tc) => !tc.isHidden)
                              .map((testCase, index) => (
                                <Card
                                  key={index}
                                  className="bg-gray-50 border-gray-200"
                                >
                                  <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
                                    <div className="font-medium">
                                      Test Case {index + 1}
                                    </div>
                                    {testResults[index] && (
                                      <Badge
                                        className={
                                          testResults[index].passed
                                            ? 'bg-green-600'
                                            : 'bg-red-600'
                                        }
                                      >
                                        {testResults[index].passed
                                          ? 'Passed'
                                          : 'Failed'}
                                      </Badge>
                                    )}
                                  </CardHeader>
                                  <CardContent className="py-2 px-4">
                                    <Accordion
                                      type="single"
                                      collapsible
                                      className="w-full"
                                    >
                                      <AccordionItem
                                        value="item-1"
                                        className="border-gray-200"
                                      >
                                        <AccordionTrigger className="text-sm py-2">
                                          Input
                                        </AccordionTrigger>
                                        <AccordionContent>
                                          <pre className="bg-white p-2 rounded-md text-xs border border-gray-200 overflow-x-auto whitespace-pre-wrap">
                                            {testCase.input}
                                          </pre>
                                        </AccordionContent>
                                      </AccordionItem>
                                      <AccordionItem
                                        value="item-2"
                                        className="border-gray-200"
                                      >
                                        <AccordionTrigger className="text-sm py-2">
                                          Expected Output
                                        </AccordionTrigger>
                                        <AccordionContent>
                                          <pre className="bg-white p-2 rounded-md text-xs border border-gray-200 overflow-x-auto whitespace-pre-wrap">
                                            {testCase.output}
                                          </pre>
                                        </AccordionContent>
                                      </AccordionItem>
                                      {testResults[index] && (
                                        <AccordionItem
                                          value="item-3"
                                          className="border-gray-200"
                                        >
                                          <AccordionTrigger className="text-sm py-2">
                                            Your Output
                                          </AccordionTrigger>
                                          <AccordionContent>
                                            <pre className="bg-white p-2 rounded-md text-xs border border-gray-200 overflow-x-auto whitespace-pre-wrap">
                                              {testResults[index].actual}
                                            </pre>
                                          </AccordionContent>
                                        </AccordionItem>
                                      )}
                                    </Accordion>

                                    <div className="flex justify-end mt-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs bg-white hover:bg-gray-50 border-gray-200"
                                        onClick={() =>
                                          runTestCase(testCase, index)
                                        }
                                      >
                                        Run Test
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        </TabsContent>
                      </div>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="justify-end py-3 bg-gray-50 rounded-b-lg">
                    <Button
                      onClick={submitSolution}
                      disabled={isTestingAll}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isTestingAll ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Submit Solution
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {/* Editor and IO Sections - Now in a column layout */}
            <div className={`flex flex-col flex-1 max-h-full ${showProblem ? 'md:w-2/3 lg:w-3/4' : 'w-full'}`} >
              {/* Code Editor */}
              <Card className="flex flex-col bg-white border-gray-200 text-gray-800 mb-4 p-0" ref={editorContainerRef} >
                <CardHeader className="py-2 flex flex-row items-center justify-between bg-gray-50 rounded-t-lg">
                  <CardTitle className="flex items-center text-md font-medium">
                    <FileCode className="mr-2 h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">
                      {monacoLanguage.toUpperCase()}
                    </span>
                  </CardTitle>
                  <div className="flex space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={formatCode}
                            className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Format Code</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={copyCode}
                            className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy Code</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={downloadCode}
                            className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Download Code</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent
                  className="p-0 overflow-hidden"
                  style={{ height: editorHeight }}
                >
                  <Editor
                    height="100%"
                    language={monacoLanguage}
                    value={code}
                    theme={theme}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    options={{
                      minimap: {
                        enabled: true,
                        scale: 10,
                        showSlider: 'mouseover',
                      },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      suggestOnTriggerCharacters: true,
                      quickSuggestions: true,
                      snippetSuggestions: 'inline',
                      formatOnType: true,
                      bracketPairColorization: {
                        enabled: true,
                      },
                      scrollbar: {
                        verticalScrollbarSize: 8,
                        horizontalScrollbarSize: 8,
                        verticalSliderSize: 8,
                        horizontalSliderSize: 8,
                        verticalHasArrows: false,
                        horizontalHasArrows: false,
                        arrowSize: 15,
                      },
                    }}
                  />
                </CardContent>
                <CardFooter className="justify-between py-3 bg-gray-50 rounded-b-lg">
                  <div className="flex items-center space-x-3">
                    <Badge
                      className={`${statusBadge.color} text-white px-3 py-1`}
                    >
                      {statusBadge.label}
                    </Badge>
                    {executionTime && (
                      <Badge
                        variant="outline"
                        className="bg-white text-gray-700 border-gray-300"
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        {executionTime}s
                      </Badge>
                    )}
                    {memoryUsage && (
                      <Badge
                        variant="outline"
                        className="bg-white text-gray-700 border-gray-300"
                      >
                        <Database className="mr-1 h-3 w-3" />
                        {memoryUsage} KB
                      </Badge>
                    )}
                  </div>
                  <Button
                    onClick={() => {
                      if (autoFormat && editorInstance) {
                        editorInstance
                          .getAction('editor.action.formatDocument')
                          .run();
                      }
                      runCustomTest();
                    }}
                    disabled={isRunning}
                    className={`bg-blue-600 hover:bg-blue-700 text-white ${isRunning ? 'opacity-70' : ''
                      }`}
                  >
                    {isRunning ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Run Code
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Input/Output/History - Now below the editor */}
              <Card className="flex flex-col bg-white border-gray-200 text-gray-800 flex-grow">
                <Tabs defaultValue="output" className="flex flex-col h-full">
                  <CardHeader className="py-2 bg-gray-50 rounded-t-lg">
                    <div className="flex justify-between items-center">
                      <TabsList className="bg-gray-100">
                        <TabsTrigger
                          value="output"
                          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        >
                          <Terminal className="mr-2 h-4 w-4" />
                          Output
                        </TabsTrigger>
                        <TabsTrigger
                          value="input"
                          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        >
                          <FileInput className="mr-2 h-4 w-4" />
                          Input
                        </TabsTrigger>
                        <TabsTrigger
                          value="history"
                          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        >
                          <History className="mr-2 h-4 w-4" />
                          History
                        </TabsTrigger>
                      </TabsList>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow overflow-hidden p-0">
                    <TabsContent value="output" className="h-full m-0">
                      <div className="bg-gray-50 text-gray-800 h-full p-4 font-mono text-sm overflow-auto">
                        {output ? (
                          <pre>{output}</pre>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Terminal className="h-10 w-10 mb-2" />
                            <p>Run your code to see output here</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="input" className="h-full m-0">
                      <Editor
                        height="100%"
                        language="plaintext"
                        value={stdin}
                        theme={theme}
                        onChange={handleStdinChange}
                        options={{
                          minimap: { enabled: false },
                          fontSize: editorFontSize,
                          lineNumbers: 'off',
                          scrollBeyondLastLine: false,
                          wordWrap: 'on',
                          automaticLayout: true,
                          scrollbar: {
                            verticalScrollbarSize: 8,
                            horizontalScrollbarSize: 8,
                          },
                        }}
                      />
                    </TabsContent>
                    <TabsContent value="history" className="h-full m-0 p-0">
                      <div className="bg-gray-50 text-gray-800 h-full overflow-auto">
                        {recentSubmissions.length > 0 ? (
                          <div className="divide-y divide-gray-200">
                            {recentSubmissions.map((submission) => (
                              <div
                                key={submission.id}
                                className="p-3 hover:bg-gray-100"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">
                                    {submission.language}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {submission.timestamp}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                  <Badge
                                    className={
                                      submission.status === 'Success'
                                        ? 'bg-green-500'
                                        : submission.status ===
                                          'Compilation Error'
                                          ? 'bg-red-500'
                                          : 'bg-yellow-500'
                                    }
                                  >
                                    {submission.status}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {submission.time}s
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <History className="h-10 w-10 mb-2" />
                            <p>No recent submissions</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </CardContent>
                </Tabs>
              </Card>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center p-4">
            <p>Connected to Judge0 API at {BASE_URL} | © CodeChef Runner 2025</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeEditor;
