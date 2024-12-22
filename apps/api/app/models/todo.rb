class Todo < ApplicationRecord
  validates :name, presence: true
  validates :checked, inclusion: { in: [true, false] }
end
