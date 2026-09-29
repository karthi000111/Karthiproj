export const javaInterviewQuestions = [
  {
    id: 1,
    concept: 'Inheritance',
    scenario:
      'A company has Employee as a parent class and Developer and Tester as child classes. Both child classes need the employee\'s name and ID, but each has different work methods.',
    question: 'Which Java concept would you use and why?',
    expectedAnswer:
      'Use inheritance. Developer and Tester can extend Employee and reuse its common properties and methods while adding their own functionality.',
  },
  {
    id: 2,
    concept: 'Method Overriding',
    scenario:
      'class Employee {\n    void work() {\n        System.out.println("Employee works");\n    }\n}\n\nclass Developer extends Employee {\n    void work() {\n        System.out.println("Developer writes code");\n    }\n}',
    question: 'What will be printed and why?',
    expectedAnswer:
      'Developer writes code. This is method overriding. The actual object is Developer, so the overridden method is selected at runtime.',
  },
  {
    id: 3,
    concept: 'Method Overloading',
    scenario:
      'You are designing a calculator. You want one add() method to work with two integers and another to work with three integers.',
    question: 'What concept can you use?',
    expectedAnswer:
      'Use method overloading. int add(int a, int b) and int add(int a, int b, int c) share the same method name but different parameter lists.',
  },
  {
    id: 4,
    concept: 'Interface vs Class',
    scenario:
      'Your application supports different payment methods: UPI, Credit Card, and Net Banking. Every payment method must implement pay().',
    question: 'Which Java feature would be suitable?',
    expectedAnswer:
      'An interface is suitable because it can define a common contract: interface Payment { void pay(); } Each payment class implements it differently.',
  },
  {
    id: 5,
    concept: 'Abstract Class',
    scenario:
      'You have Vehicle as a common concept. Every vehicle should have start(), but the implementation differs for a car and bike. You also want to provide some common vehicle functionality.',
    question: 'Interface or abstract class?',
    expectedAnswer:
      'An abstract class is suitable when you want both common implementation and abstract methods. abstract class Vehicle { abstract void start(); void stop() { System.out.println("Vehicle stopped"); } }',
  },
  {
    id: 6,
    concept: 'Exception Handling',
    scenario:
      'A banking application divides an amount by a value entered by the user. Sometimes the user enters 0, causing an exception.',
    question: 'How would you prevent the application from crashing?',
    expectedAnswer:
      'Use exception handling with try-catch. try { int result = amount / value; } catch (ArithmeticException e) { System.out.println("Cannot divide by zero"); }',
  },
  {
    id: 7,
    concept: 'finally',
    scenario:
      'A program opens a file and performs some operations. Whether the operation succeeds or fails, you need to perform cleanup.',
    question: 'Which block is commonly used?',
    expectedAnswer:
      'The finally block is used for code that should always execute after try/catch processing, such as cleanup.',
  },
  {
    id: 8,
    concept: 'ArrayList vs Array',
    scenario:
      'You are creating an application where the number of students changes frequently. You do not know the exact number of students when the program starts.',
    question: 'Would you use an array or ArrayList?',
    expectedAnswer:
      'ArrayList is more suitable because its size can grow or shrink dynamically. ArrayList<String> students = new ArrayList<>();',
  },
  {
    id: 9,
    concept: 'HashMap',
    scenario:
      'A college application needs to quickly find a student\'s name using their roll number. 101 -> Karthi, 102 -> Arun, 103 -> Priya',
    question: 'Which collection would you choose?',
    expectedAnswer:
      'Use HashMap because it stores data as key-value pairs. HashMap<Integer, String> students = new HashMap<>();',
  },
  {
    id: 10,
    concept: 'HashSet',
    scenario:
      'A website receives the following user IDs: 101 102 101 103 102. You want to store only unique IDs.',
    question: 'Which collection is appropriate?',
    expectedAnswer:
      'Use HashSet because it does not allow duplicate elements. Conceptually the result is 101, 102, 103.',
  },
  {
    id: 11,
    concept: 'String Immutability',
    scenario:
      'String s = "Java"; s.concat(" Programming"); System.out.println(s);',
    question: 'What is the output?',
    expectedAnswer:
      'Java. String objects are immutable. concat() creates a new String, but the result was not assigned back to s.',
  },
  {
    id: 12,
    concept: '== vs .equals()',
    scenario:
      'String a = new String("Java"); String b = new String("Java"); System.out.println(a == b); System.out.println(a.equals(b));',
    question: 'What is the output?',
    expectedAnswer:
      'false then true. == compares object references, while .equals() compares the contents of the strings.',
  },
  {
    id: 13,
    concept: 'NullPointerException',
    scenario: 'String name = null; System.out.println(name.length());',
    question: 'What happens?',
    expectedAnswer:
      'A NullPointerException occurs because name does not refer to a String object.',
  },
  {
    id: 14,
    concept: 'Static Variable',
    scenario:
      'A company has 500 employees, but the company name is the same for every employee.',
    question: 'Should every employee object have its own copy of the company name?',
    expectedAnswer:
      'No. A static variable can be shared among all objects of the class. static String company = "ABC";',
  },
  {
    id: 15,
    concept: 'Constructor',
    scenario:
      'Whenever a new Student object is created, you want the student\'s name and roll number to be initialized automatically.',
    question: 'What would you use?',
    expectedAnswer:
      'Use a constructor. Student(String name, int rollNo) { this.name = name; this.rollNo = rollNo; }',
  },
  {
    id: 16,
    concept: 'Encapsulation',
    scenario:
      'A banking application should not allow other classes to directly modify an account\'s balance.',
    question: 'How would you protect it?',
    expectedAnswer:
      'Use encapsulation by making the variable private and providing controlled methods. private double balance; public double getBalance() { return balance; }',
  },
  {
    id: 17,
    concept: 'Upcasting',
    scenario: 'class Animal {} class Dog extends Animal {} Animal a = new Dog();',
    question: 'Is this valid? What concept is being used?',
    expectedAnswer:
      'Yes. This is upcasting, where a child object is referenced using a parent-class reference.',
  },
  {
    id: 18,
    concept: 'Multithreading',
    scenario:
      'A mobile application needs to download a file while simultaneously allowing the user to interact with the application.',
    question: 'What Java concept can help perform these tasks concurrently?',
    expectedAnswer:
      'Multithreading can be used so different tasks can execute concurrently.',
  },
  {
    id: 19,
    concept: 'Synchronization',
    scenario:
      'Two threads are simultaneously updating the same bank account balance. Sometimes the final balance is incorrect.',
    question: 'What is the problem and how can it be addressed?',
    expectedAnswer:
      'This is a race condition caused by concurrent access to shared data. Synchronization can control access to the critical section. synchronized void updateBalance() { }',
  },
  {
    id: 20,
    concept: 'Choosing the Right Collection',
    scenario:
      'You need a collection where duplicates are allowed, insertion order should be maintained, and elements are accessed by index.',
    question: 'Which collection would you choose?',
    expectedAnswer:
      'ArrayList is suitable because it allows duplicates, maintains insertion order, and supports index-based access.',
  },
];
