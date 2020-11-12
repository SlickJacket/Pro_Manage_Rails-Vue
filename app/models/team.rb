class Team < ApplicationRecord
    has_many :projects, dependent: :destroy

    has_many :users

    accept_nested_attributes_for :user, allow_destroy :true
end
