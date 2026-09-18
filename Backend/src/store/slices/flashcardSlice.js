import {createSlice} from '@reduxjs/toolkit';

const makeCardsForTopics = (deckId, topics) =>
  Object.entries(topics).flatMap(([subject, questions]) =>
    questions.map(({question, answer, difficulty}, index) => ({
      id: `${deckId}-${subject.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index + 1}`,
      deckId,
      subject,
      question,
      answer,
      difficulty,
    })),
  );

const initialState = {
  completedIds: [],
  favouriteIds: [],
  decks: [
    {id: 'java', title: 'Java', description: 'OOP, inheritance, and core Java concepts.'},
    {id: 'computer-networks', title: 'Computer Networks', description: 'OSI, TCP/IP, routing, and networking fundamentals.'},
    {id: 'operating-system', title: 'Operating System', description: 'Processes, threads, memory, and scheduling essentials.'},
  ],
  selectedDeckId: 'java',
  cardProgress: {},
  items: makeCardsForTopics('java', {
    'OOP Concepts': [
      {question: 'What is object-oriented programming?', answer: 'OOP organizes software around objects that bundle data and behavior; it improves modularity and code reuse.', difficulty: 'Easy'},
      {question: 'What is a class in Java?', answer: 'A class is a blueprint that defines attributes and methods for creating objects.', difficulty: 'Easy'},
      {question: 'What is an object?', answer: 'An object is an instance of a class with its own state and behavior at runtime.', difficulty: 'Easy'},
      {question: 'Why is encapsulation important?', answer: 'Encapsulation hides internal implementation details and exposes only necessary interfaces.', difficulty: 'Medium'},
      {question: 'How do access modifiers help?', answer: 'They control visibility and restrict where fields and methods can be accessed from.', difficulty: 'Medium'},
      {question: 'What is abstraction?', answer: 'Abstraction focuses on essential characteristics while hiding unnecessary implementation details.', difficulty: 'Medium'},
      {question: 'What is a constructor?', answer: 'A constructor initializes an object when it is created and often sets initial attribute values.', difficulty: 'Easy'},
      {question: 'What is method overloading?', answer: 'Method overloading allows multiple methods with the same name but different parameter lists.', difficulty: 'Medium'},
      {question: 'What is method overriding?', answer: 'Method overriding lets a subclass provide a different implementation of an inherited method.', difficulty: 'Medium'},
      {question: 'What is the difference between a class and an interface?', answer: 'A class can provide implementation, while an interface defines a contract that classes implement.', difficulty: 'Medium'},
    ],
    Inheritance: [
      {question: 'What is inheritance?', answer: 'Inheritance allows a subclass to reuse methods and fields from a parent class.', difficulty: 'Easy'},
      {question: 'Why do we use inheritance?', answer: 'It reduces duplication and models real-world relationships between general and specialized types.', difficulty: 'Easy'},
      {question: 'What is the superclass?', answer: 'The superclass is the parent class that defines shared behavior and attributes.', difficulty: 'Easy'},
      {question: 'What is a subclass?', answer: 'A subclass extends a superclass and can add or override behavior.', difficulty: 'Easy'},
      {question: 'What is single inheritance?', answer: 'Single inheritance means a class inherits from only one direct superclass.', difficulty: 'Medium'},
      {question: 'What is the Object class?', answer: 'The Object class is the root of the Java class hierarchy and provides common methods like toString and equals.', difficulty: 'Medium'},
      {question: 'How does constructor chaining work?', answer: 'A subclass constructor calls a superclass constructor to initialize inherited state.', difficulty: 'Medium'},
      {question: 'What is the protected access modifier used for?', answer: 'Protected members can be accessed by the class itself, subclasses, and classes in the same package.', difficulty: 'Medium'},
      {question: 'Can a class inherit multiple classes in Java?', answer: 'No, Java supports single inheritance for classes but allows multiple interfaces.', difficulty: 'Easy'},
      {question: 'Why is inheritance sometimes considered fragile?', answer: 'Changes in a superclass can affect many subclasses and cause unintended side effects.', difficulty: 'Medium'},
    ],
    Polymorphism: [
      {question: 'What is polymorphism?', answer: 'Polymorphism allows a single method call to behave differently depending on the object type.', difficulty: 'Easy'},
      {question: 'What is runtime polymorphism?', answer: 'Runtime polymorphism occurs when overriding methods are resolved dynamically at execution time.', difficulty: 'Medium'},
      {question: 'What is compile-time polymorphism?', answer: 'Compile-time polymorphism is achieved by method overloading based on parameter signatures.', difficulty: 'Medium'},
      {question: 'Why is overriding important?', answer: 'It lets subclasses change inherited behavior without changing the method contract.', difficulty: 'Medium'},
      {question: 'What is a parent reference pointing to a child object?', answer: 'This is a common polymorphic pattern where a superclass variable holds a subclass instance.', difficulty: 'Medium'},
      {question: 'How does Java decide which method to call?', answer: 'Java uses the actual object type at runtime for overridden methods and the declared type for static methods.', difficulty: 'Hard'},
      {question: 'What is dynamic dispatch?', answer: 'Dynamic dispatch selects the correct overridden method implementation at runtime.', difficulty: 'Hard'},
      {question: 'Can methods be overloaded with different return types?', answer: 'No, return type alone is not enough to overload a method; the parameter list must differ.', difficulty: 'Medium'},
      {question: 'What is the purpose of interfaces in polymorphism?', answer: 'Interfaces allow unrelated classes to share a common API and be treated uniformly.', difficulty: 'Medium'},
      {question: 'How is polymorphism useful in collections?', answer: 'Many collections can store objects via a common parent type or interface and process them uniformly.', difficulty: 'Medium'},
    ],
  }).concat(
    makeCardsForTopics('computer-networks', {
      'OSI Model': [
        {question: 'What are the seven layers of the OSI model?', answer: 'The layers are Physical, Data Link, Network, Transport, Session, Presentation, and Application.', difficulty: 'Easy'},
        {question: 'Which layer handles physical transmission?', answer: 'The Physical layer handles raw bit transmission over cables, radio, or optical media.', difficulty: 'Easy'},
        {question: 'Why is the Data Link layer important?', answer: 'It provides node-to-node delivery and media access control for local network communication.', difficulty: 'Medium'},
        {question: 'What does the Network layer do?', answer: 'It forwards packets across networks using logical addresses and routing decisions.', difficulty: 'Medium'},
        {question: 'What is the role of the Transport layer?', answer: 'It ensures end-to-end delivery, segmentation, and flow control between hosts.', difficulty: 'Medium'},
        {question: 'What does the Session layer manage?', answer: 'It establishes, maintains, and ends communication sessions between applications.', difficulty: 'Medium'},
        {question: 'What does the Presentation layer do?', answer: 'It translates, compresses, and encrypts data so applications can understand it.', difficulty: 'Medium'},
        {question: 'Which layer is closest to the user?', answer: 'The Application layer is closest to end users and application software.', difficulty: 'Easy'},
        {question: 'Why is OSI useful as a model?', answer: 'It provides a standardized framework for describing networking functions and troubleshooting.', difficulty: 'Easy'},
        {question: 'How do layers communicate?', answer: 'Each layer communicates with the peer layer on the receiving system through well-defined interfaces.', difficulty: 'Medium'},
      ],
      'TCP/IP': [
        {question: 'What is TCP?', answer: 'TCP is a connection-oriented protocol that provides reliable, ordered data delivery.', difficulty: 'Easy'},
        {question: 'What is UDP?', answer: 'UDP is a lightweight connectionless protocol that prioritizes speed over reliability.', difficulty: 'Easy'},
        {question: 'What is the difference between TCP and IP?', answer: 'TCP provides transport reliability; IP provides routing and addressing between networks.', difficulty: 'Medium'},
        {question: 'Why is TCP more reliable than UDP?', answer: 'TCP uses acknowledgments, retransmissions, and sequencing to ensure data integrity.', difficulty: 'Medium'},
        {question: 'When is UDP preferred?', answer: 'UDP is preferred for real-time services like DNS lookups, video streaming, and voice calls.', difficulty: 'Medium'},
        {question: 'What is a socket?', answer: 'A socket is an endpoint for communication that combines an IP address and port number.', difficulty: 'Medium'},
        {question: 'What is an IP address?', answer: 'An IP address identifies a network interface and is used to route packets across networks.', difficulty: 'Easy'},
        {question: 'What is a port number?', answer: 'A port number identifies the application or service on a host that should receive a packet.', difficulty: 'Easy'},
        {question: 'How does a TCP connection begin?', answer: 'A three-way handshake establishes the connection between client and server.', difficulty: 'Medium'},
        {question: 'What is packet switching?', answer: 'Packet switching breaks data into packets that travel independently through the network.', difficulty: 'Medium'},
      ],
    }),
    makeCardsForTopics('operating-system', {
      Processes: [
        {question: 'What is a process?', answer: 'A process is an executing program with its own memory space and execution state.', difficulty: 'Easy'},
        {question: 'What is a process ID?', answer: 'A process ID is a unique identifier assigned to each running process by the OS.', difficulty: 'Easy'},
        {question: 'What is a process state?', answer: 'A process state describes whether it is running, ready, waiting, or terminated.', difficulty: 'Medium'},
        {question: 'What is a parent process?', answer: 'A parent process creates child processes and may manage or monitor them.', difficulty: 'Easy'},
        {question: 'Why does the OS create process control blocks?', answer: 'The OS stores process metadata in a PCB so it can manage execution and scheduling.', difficulty: 'Medium'},
        {question: 'What is context switching?', answer: 'Context switching stores one process state and restores another so multiple processes share CPU time.', difficulty: 'Medium'},
        {question: 'What is a zombie process?', answer: 'A zombie process has terminated but still has an entry in the process table until its parent reaps it.', difficulty: 'Hard'},
        {question: 'What is the difference between a foreground and background process?', answer: 'Foreground processes interact with the user directly, while background processes run without direct interaction.', difficulty: 'Easy'},
        {question: 'Why do processes need separate memory spaces?', answer: 'Isolation protects one process from another and prevents accidental memory corruption.', difficulty: 'Medium'},
        {question: 'How does the OS manage process creation?', answer: 'The OS allocates resources, creates a process structure, and schedules the new process for execution.', difficulty: 'Medium'},
      ],
      Threads: [
        {question: 'What is a thread?', answer: 'A thread is a lightweight execution unit that shares a process’s resources with other threads.', difficulty: 'Easy'},
        {question: 'How is a thread different from a process?', answer: 'A process owns its own memory; threads share memory within a process and are lighter to create.', difficulty: 'Easy'},
        {question: 'Why are threads useful?', answer: 'Threads allow programs to perform multiple tasks concurrently and improve responsiveness.', difficulty: 'Medium'},
        {question: 'What is multithreading?', answer: 'Multithreading is the execution of multiple threads within a process to perform work in parallel or concurrently.', difficulty: 'Easy'},
        {question: 'What is the CPU thread count?', answer: 'It refers to the number of execution threads the system can schedule at once on available cores or virtual cores.', difficulty: 'Medium'},
        {question: 'What is a race condition?', answer: 'A race condition occurs when multiple threads access shared data without synchronization and the outcome depends on timing.', difficulty: 'Hard'},
        {question: 'Why is synchronization important?', answer: 'Synchronization ensures that shared data is accessed consistently without corruption or inconsistent states.', difficulty: 'Medium'},
        {question: 'What is a mutex?', answer: 'A mutex is a lock that allows only one thread to access a critical section at a time.', difficulty: 'Medium'},
        {question: 'What is a thread pool?', answer: 'A thread pool reuses a fixed number of threads to handle multiple tasks efficiently.', difficulty: 'Medium'},
        {question: 'What happens if a thread blocks on I/O?', answer: 'The OS can schedule another runnable thread while the blocked thread waits for the I/O operation to complete.', difficulty: 'Medium'},
      ],
    }),
  ),
};

const flashcardSlice = createSlice({
  name: 'flashcards', initialState,
  reducers: {
    hydrateFlashcards: (state, action) => {
      state.completedIds = action.payload.completedIds || [];
      state.favouriteIds = action.payload.favouriteIds || [];
      if (Array.isArray(action.payload.items)) state.items = action.payload.items;
      if (Array.isArray(action.payload.decks) && action.payload.decks.length) {
        state.decks = action.payload.decks;
      }
      state.selectedDeckId = action.payload.selectedDeckId || state.decks[0].id;
      state.cardProgress = action.payload.cardProgress || {};
      state.items.forEach(card => {
        if (!card.deckId) card.deckId = state.decks[0].id;
      });
    },
    addFlashcard: (state, action) => {
      state.items.push(action.payload);
    },
    addDeck: (state, action) => {
      state.decks.push(action.payload);
    },
    selectDeck: (state, action) => {
      state.selectedDeckId = action.payload;
    },
    recordReview: (state, action) => {
      const {id, rating} = action.payload;
      const previous = state.cardProgress[id] || {level: 0, reviews: 0};
      const levelChange = rating === 'gotIt' ? 1 : rating === 'hard' ? -1 : -2;
      state.cardProgress[id] = {
        level: Math.max(0, Math.min(5, previous.level + levelChange)),
        reviews: previous.reviews + 1,
        lastReviewed: Date.now(),
      };
      if (rating === 'gotIt' && !state.completedIds.includes(id)) {
        state.completedIds.push(id);
      }
    },
    markCompleted: (state, action) => { if (!state.completedIds.includes(action.payload)) state.completedIds.push(action.payload); },
    toggleFavourite: (state, action) => { const index = state.favouriteIds.indexOf(action.payload); if (index === -1) state.favouriteIds.push(action.payload); else state.favouriteIds.splice(index, 1); },
  },
});

export const {addDeck, addFlashcard, hydrateFlashcards, markCompleted, recordReview, selectDeck, toggleFavourite} = flashcardSlice.actions;
export default flashcardSlice.reducer;
