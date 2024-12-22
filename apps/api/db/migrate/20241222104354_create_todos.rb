class CreateTodos < ActiveRecord::Migration[7.1]
  def change
    create_table :todos do |t|
      t.string :name, null: false
      t.boolean :checked, null: false

      t.timestamps
    end
  end
end
