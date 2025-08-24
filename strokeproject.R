
# Stroke Prediction Model using Machine Learning in R
# Author: Aashna Shetty | Created: July 2025

# -------------------------------
# 1. Load Required Libraries
# -------------------------------
library(tidyverse)
library(caret)
library(randomForest)
library(ROCR)

# ------- 1. Load and inspect Dataset --------
# Load the Dataset
stroke_data <- read.csv("C:/Users/Sowmya Shetty/Desktop/Projects/Stroke Project/healthcare-dataset-stroke-data.csv")

# First few rows of the Dataset
head(stroke_data)

# Structure of each column
str(stroke_data)

# Statistical summary of numeric columns
summary(stroke_data)


# ------- 2. Cleaning and Preprocessing --------
# Converting to character to inspect and clean
stroke_data$bmi <- as.character(stroke_data$bmi)

# Identifying and replace problematic entries
# Replace empty strings, spaces, and "NA" text with actual NA
stroke_data$bmi[stroke_data$bmi == "" | stroke_data$bmi == " " | stroke_data$bmi == "NA"] <- NA

# Converting to numeric
stroke_data$bmi <- as.numeric(stroke_data$bmi)

# Filling in missing values with mean
stroke_data$bmi[is.na(stroke_data$bmi)] <- mean(stroke_data$bmi, na.rm = TRUE)
str(stroke_data$bmi)
summary(stroke_data$bmi)


# ------- 3. Building the Model (Train - Test - Split)  --------
# Converting to factor
stroke_data$stroke <- as.factor(stroke_data$stroke)

# Set a seed for reproducibility
set.seed(123)

# Creating index for training data (70%)
trainIndex <- createDataPartition(stroke_data$stroke, p = 0.7, list = FALSE)

# Split the data
train <- stroke_data[trainIndex, ]
test <- stroke_data[-trainIndex, ]

# Checking dimensions
dim(train)   # Rows and columns in training set
dim(test)    # Rows and columns in testing set


# ------- 4. Building the Model with Random Forest  --------
# Building the model
library(randomForest)

# Train the model directly
rf_model <- randomForest(stroke ~ ., data = train, ntree = 100)

# View results
print(rf_model)


# ------- 5. Model Evaluation  --------
library(caret)

# Making predictions
predictions <- predict(rf_model, newdata = test)

# Confusion matrix
confusionMatrix(predictions, test$stroke)


# ------- 6. Improving Model Performance  --------
# Loading caret for easy downsampling
install.packages("caret")
library(caret)

# Verifying stroke column is a factor
train$stroke <- as.factor(train$stroke)

# Downsample majority class to match minority class
set.seed(123)  # For repeatability
down_train <- downSample(x = train[, -which(names(train) == "stroke")],
                         y = train$stroke)

# Rename the target column to 'stroke' again
colnames(down_train)[ncol(down_train)] <- "stroke"
table(down_train$stroke)

library(randomForest)
balanced_rf <- randomForest(stroke ~ ., data = down_train, ntree = 100)
predictions <- predict(balanced_rf, newdata = test)

library(caret)
confusionMatrix(predictions, test$stroke)


# ------- 7. Model Tuning and Feature Importance  --------
#Tuning the model with carat
library(caret)

# Create control settings for cross-validation
ctrl <- trainControl(method = "cv", number = 5)

# Train Random Forest with tuning grid
tuned_model <- train(stroke ~ ., data = down_train,
                     method = "rf",
                     trControl = ctrl,
                     tuneGrid = data.frame(mtry = c(2, 3, 4, 5)))

#Viewing the best model results
print(tuned_model)
plot(tuned_model)

#Checking variable importance
varImp(tuned_model)

#Saving the trained model
saveRDS(balanced_rf, "balanced_rf_model.rds")

colnames(down_train)

str(stroke_data)

names(down_train)

