# Library of bash-functions to access https://getpantry.cloud/ API
#
# To avail the functions listed herein, source this script as
#
# source ./pantry-client.bash "Your_Pantry_ID_here"
#
# Tip: Put the above command inside ~/.bashrc to avoid sourcing manually everytime
#
# Author: Somajit Dey <dey.somajit@gmail.com> 2021

export PANTRY_ID="${1:-"${PANTRY_ID}"}"

[[ -z "${PANTRY_ID}" ]] && \
echo 'Warning: PANTRY_ID not set
Execute command: export PANTRY_ID="Your_Pantry_ID_here"'

pantry_curl(){
  # Common cURL parameters to avoid code duplication
  # Usage: pantry_curl POST|GET|PUT|DEL <basket name>
  #
  # Note: PANTRY_BASE_URL is available globally for later use, if any, after a single
  # invocation of this function
  
  [[ -n "${PANTRY_ID}" ]] || \
  { echo "Please set the environment variable PANTRY_ID with your Pantry ID" && return 1;}
  
  declare -xg PANTRY_BASE_URL="https://getpantry.cloud/apiv1/pantry/${PANTRY_ID}"
  
  local method="${1}"
  local basket="${2}"
  shift;shift
  local endpoint_url="${PANTRY_BASE_URL}/basket/${basket}"
  curl -fsSL -H 'Content-Type: application/json' -X "${method}" "${endpoint_url}" $@

}; export -f pantry_curl

pantry_create(){
  # Create/Replace basket passed as parameter
  
  local basket="${1}"
  pantry_curl POST "${basket}"
  
}; export -f pantry_create

pantry_update(){
  # Update basket passed as parameter. Read payload json from stdin.
  
  local basket="${1}"
  pantry_curl PUT "${basket}" -d @-
  
}; export -f pantry_update

pantry_retrieve(){
  # Return full contents of basket passed as parameter.
  
  local basket="${1}"
  pantry_curl GET "${basket}"
  
}; export -f pantry_retrieve

pantry_delete(){
  # Delete basket passed as parameter.
  
  local basket="${1}"
  pantry_curl DELETE "${basket}"
  
}; export -f pantry_delete
