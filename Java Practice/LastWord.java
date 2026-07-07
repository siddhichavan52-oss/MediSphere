class Solution {
    public int lengthOfLastWord(String s) {
        int i=s.length()-1;
        int l=0;
        while(i>=0 && s.charAt(i)==' ')
        {
            i--;
        }
        while(i>=0 && s.charAt(i)!=' ')
        {
            l++;
            i--;
        }
        return l;
    }
}
class LastWord
{
    public static void main(String[] args) 
    {
        Solution obj1=new Solution();
        System.out.println(obj1.lengthOfLastWord("Hello World"));
    }
}