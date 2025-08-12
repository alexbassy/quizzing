import { QuestionEntry, QuestionType } from './store/db'

export interface ParsedQuestion {
  title: string
  options: string[]
  correctOption?: number
}

/**
 * Parses a markdown-formatted quiz string into question objects
 * Format:
 * Question title?
 * - [ ] Option 1
 * - [x] Option 2 (correct)
 * - [ ] Option 3
 * - [ ] Option 4
 * 
 * If no option is marked with [x], no correct answer will be set
 */
export function parseQuizMarkdown(markdown: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = []
  
  // Split by double newlines to separate questions
  const questionBlocks = markdown.trim().split(/\n\s*\n/)
  
  for (const block of questionBlocks) {
    const lines = block.trim().split('\n')
    if (lines.length === 0) continue
    
    // First line should be the question title
    const title = lines[0].trim()
    if (!title) continue
    
    const options: string[] = []
    let correctOption: number | undefined
    
    // Parse options from remaining lines
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Match markdown checkbox format: - [ ] or - [x]
      const checkboxMatch = line.match(/^-\s*\[([x\s])\]\s*(.+)/)
      if (checkboxMatch) {
        const isChecked = checkboxMatch[1].toLowerCase() === 'x'
        const optionText = checkboxMatch[2].trim()
        
        if (isChecked) {
          correctOption = options.length
        }
        
        options.push(optionText)
      }
    }
    
    // Only add question if it has a title and at least one option
    if (title && options.length > 0) {
      questions.push({
        title,
        options,
        correctOption
      })
    }
  }
  
  return questions
}

/**
 * Converts parsed questions into QuestionEntry objects ready for database storage
 */
export function createQuestionEntries(
  parsedQuestions: ParsedQuestion[], 
  quizId: string
): Partial<QuestionEntry>[] {
  return parsedQuestions.map(question => ({
    quizId,
    type: QuestionType.Text,
    title: question.title,
    options: question.options,
    correctOption: question.correctOption,
    backgroundColor: getRandomColor()
  }))
}

/**
 * Generate a random dark color for question backgrounds
 */
function getRandomColor(): string {
  const colors = [
    '#1e3a8a', // blue-800
    '#7c2d12', // orange-800  
    '#166534', // green-800
    '#7c2d12', // red-800
    '#581c87', // purple-800
    '#0f766e', // teal-800
    '#a21caf', // fuchsia-800
    '#be185d', // pink-800
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
