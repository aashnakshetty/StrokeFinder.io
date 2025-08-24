`%||%` <- function(a, b) if (!is.null(a)) a else b


library(plumber)
library(jsonlite)
library(randomForest)

#* @filter cors
function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type")
  
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    res$body <- ""
    return(res)
  }
  
  forward()
}

#* @post /predict
#* @serializer unboxedJSON
function(req) {
  tryCatch({
    input <- fromJSON(req$postBody)

    newdata <- data.frame(
      id = 1,
      age = as.numeric(input$age %||% NA),
      avg_glucose_level = as.numeric(input$avg_glucose_level %||% NA),
      bmi = as.numeric(input$bmi %||% NA),
      hypertension = as.integer(input$hypertension %||% NA),
      heart_disease = as.integer(input$heart_disease %||% NA),
      gender = input$gender %||% NA,
      ever_married = input$ever_married %||% NA,
      work_type = input$work_type %||% NA,
      Residence_type = input$Residence_type %||% NA,
      smoking_status = input$smoking_status %||% NA,
      stringsAsFactors = FALSE
    )

    print("📥 Received input:")
    print(newdata)

    model <- readRDS("balanced_rf_model.rds")
    result <- predict(model, newdata)

    print("📊 Prediction result:")
    print(result)

    if (result == 1) {
      list(prediction = "⚠️ High Stroke Risk Identified. Please consult a healthcare professional for guidance.")
    } else {
      list(prediction = "✅ Stroke Risk Appears Low. Keep up the great habits and stay proactive!")
    }
  }, error = function(e) {
    print(paste("❌ API error:", e$message))
    list(prediction = "Unknown")
  })
}
