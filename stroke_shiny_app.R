# Load packages
library(shiny)
library(randomForest)

# Load the saved model
balanced_rf <- readRDS("C:\\Users\\Sowmya Shetty\\Desktop\\Projects\\Stroke Project\\balanced_rf_model.rds")

# UI
ui <- fluidPage(
  tags$head(
    tags$link(rel = "stylesheet", type = "text/css", href = "style.css")
  ),
  
  titlePanel("🩺 Stroke Risk Prediction App"),
  
  sidebarLayout(
    sidebarPanel(
      div(class = "sidebar",
          h4("🧠 Enter Health Info:"),
          numericInput("age", "Age:", value = 60, min = 1, max = 120),
          numericInput("glucose", "Avg Glucose Level:", value = 100),
          numericInput("bmi", "BMI:", value = 25),
          selectInput("hypertension", "Hypertension:", choices = c("Yes", "No")),
          selectInput("heart_disease", "Heart Disease:", choices = c("Yes", "No")),
          selectInput("gender", "Gender:", choices = c("Male", "Female")),
          selectInput("married", "Ever Married:", choices = c("Yes", "No")),
          selectInput("work_type", "Work Type:",
                      choices = c("Private", "Self-employed", "Govt_job", "children", "Never_worked")),
          selectInput("residence_type", "Residence Type:",
                      choices = c("Urban", "Rural")),
          selectInput("smoking", "Smoking Status:",
                      choices = c("never smoked", "formerly smoked", "smokes", "Unknown")),
          br(),
          actionButton("check", "Check Stroke Risk", class = "btn btn-primary")
      )
    ),
    
    mainPanel(
      h3("🩻 Prediction Result:"),
      verbatimTextOutput("prediction")
    )
  )
)

# Server
server <- function(input, output) {
  observeEvent(input$check, {
    output$prediction <- renderText({
      newdata <- data.frame(
        id = 1,
        age = input$age,
        avg_glucose_level = input$glucose,
        bmi = input$bmi,
        hypertension = ifelse(input$hypertension == "Yes", 1, 0),
        heart_disease = ifelse(input$heart_disease == "Yes", 1, 0),
        gender = input$gender,
        ever_married = ifelse(input$married == "Yes", "Yes", "No"),
        work_type = input$work_type,
        Residence_type = input$residence_type,
        smoking_status = input$smoking
      )
      
      result <- predict(balanced_rf, newdata)
      
      if (result == 1) {
        "⚠️ High Stroke Risk Detected. Please consult a healthcare professional."
      } else {
        "✅ Low Stroke Risk Detected. Keep living healthy!"
      }
    })
  })
}

# Run app
shinyApp(ui = ui, server = server)

names(balanced_rf$forest$xlevels)
