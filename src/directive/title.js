export default{
  inserted: function (el,binding) {
    document.title = binding.value
  }
}